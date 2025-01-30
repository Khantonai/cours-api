import { Injectable } from '@nestjs/common';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';


@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  create(createCertificateDto: CreateCertificateDto) {
    return 'This action adds a new certificate';
  }

  findAll() {
    return `This action returns all certificates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} certificate`;
  }

  update(id: number, updateCertificateDto: UpdateCertificateDto) {
    return `This action updates a #${id} certificate`;
  }

  remove(id: number) {
    return `This action removes a #${id} certificate`;
  }
}
