import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Headers,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthService } from '../auth/auth.service';
import * as sharp from 'sharp';
import { createCanvas } from 'canvas';
import { UsersService } from '../users/users.service';
import { UUID } from 'crypto';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) { }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/raw-images',
        filename: (req, file, cb) => {
          const date = new Date().toISOString().replace(/[:.]/g, '-');
          const originalFilename: string = file.originalname;
          const newFilename: string = `${date}-${originalFilename}`;
          cb(null, newFilename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PNG and JPG files are allowed'), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @Headers('Authorization') authHeader: string,
  ) {
    console.log(file);
    const date = file.filename.split('-')[0];
    const token = authHeader.split(' ')[1];
    const user: UUID = (await this.authService.getUserInfoFromToken(token)).id as UUID;
    const userInfo = await this.userService.findOneById(user);
    const imageUrl = `/uploads/raw-images/${file.filename}`;
    const modifiedImageUrl = `/uploads/modified-images/${file.filename}`;

    const messageText = `${userInfo.firstName} ${userInfo.lastName} ${userInfo.email} ${date}`;
    const inputPath = `./uploads/raw-images/${file.filename}`;
    const outputPath = `./uploads/modified-images/${file.filename}`;

    const encodedMessage = await this.steganographImage(inputPath, outputPath, messageText);

    const newImageDto = {
      ...createImageDto,
      imageUrl,
      modifiedImageUrl,
      user,
      encodedMessage,
    };

    return this.create(newImageDto);
  }

  create(createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  async steganographImage(inputPath: string,outputPath: string, message: string): Promise<void> {
    const image = sharp(inputPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const canvas = createCanvas(info.width, info.height);
    const ctx = canvas.getContext('2d');
    const textCanvas = createCanvas(info.width, info.height);
    const tctx = textCanvas.getContext('2d');

    tctx.font = "30px Arial";
    tctx.fillText(message, 10, 50);

    const imgData = ctx.createImageData(info.width, info.height);
    imgData.data.set(data);

    const textData = tctx.getImageData(0, 0, info.width, info.height);

    for (let i = 0; i < textData.data.length; i += 4) {
      if (textData.data[i + 3] !== 0) {
        if (imgData.data[i + 1] % 10 !== 7) {
          imgData.data[i + 1] = imgData.data[i + 1] > 247 ? 247 : imgData.data[i + 1];
          while (imgData.data[i + 1] % 10 !== 7) {
            imgData.data[i + 1]++;
          }
        }
      } else {
        if (imgData.data[i + 1] % 10 === 7) {
          imgData.data[i + 1]--;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const buffer = canvas.toBuffer('image/png');
    await sharp(buffer).toFile(outputPath); // Sauvegarder l'image modifiée dans le dossier modified-images
  }

  @Public()
  @Post('verify')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/raw-images',
        filename: (req, file, cb) => {
          const date = new Date().toISOString().replace(/[:.]/g, '-');
          const originalFilename: string = file.originalname;
          const newFilename: string = `${date}-${originalFilename}`;
          cb(null, newFilename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PNG and JPG files are allowed'), false);
        }
      },
    }),
  )
  async decodeFile(@UploadedFile() file: Express.Multer.File, @Res() res: Response): Promise<void> {
    const inputPath = `./uploads/raw-images/${file.filename}`;
    const decodedImageBuffer = await this.decodeSteganographImage(inputPath);
    res.setHeader('Content-Type', 'image/png');
    res.send(decodedImageBuffer);
  }

  async decodeSteganographImage(inputPath: string): Promise<Buffer> {
    const image = sharp(inputPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const canvas = createCanvas(info.width, info.height);
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(info.width, info.height);
    imgData.data.set(data);

    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 1] % 10 === 7) {
        imgData.data[i] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
      } else {
        imgData.data[i + 3] = 0;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toBuffer('image/png'); // Retourner l'image encodée en buffer
  }


  @Get()
  async findAll(@Headers('Authorization') authHeader: string) {
    const token = authHeader.split(' ')[1];
    // const user: UUID = (await this.authService.getUserInfoFromToken(token)).id as UUID;
    const user = (await this.authService.getUserInfoFromToken(token)).id as UUID;
    return this.imagesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }


}
