import { UUID } from 'crypto';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Image } from '../images/entities/image.entity';
import { Certificate } from '../certificates/entities/certificate.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: UUID;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Image, (image) => image.user, { nullable: true })
  images: Image[];

  @OneToMany(() => Certificate, (certificate) => certificate.user, {
    nullable: true,
  })
  certificates: Certificate[];
}
