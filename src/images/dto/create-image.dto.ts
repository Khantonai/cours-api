import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  imageBase64: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  modifiedImageUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  modifiedImageBase64: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  certificateId: string;
}
