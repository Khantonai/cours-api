import { UUID } from 'crypto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/users.entity';
import { Certificate } from '../../certificates/entities/certificate.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ nullable: false })
  imageUrl: string;

  @Column({ nullable: false })
  modifiedImageUrl: string;

  @ManyToOne(() => User, (user) => user.images, { nullable: false })
  user: User;

  @OneToOne(() => Certificate, (certificate) => certificate.image, {
    nullable: true,
  })
  certificate: Certificate;
}
