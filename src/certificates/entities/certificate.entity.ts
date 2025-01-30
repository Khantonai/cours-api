import { Entity, OneToOne, JoinColumn } from 'typeorm';
import { UUID } from 'crypto';
import { Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Image } from 'src/images/entities/image.entity';

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ nullable: false, default: 0 })
  views: number;

  @ManyToOne(() => User, (user) => user.certificates, { nullable: false })
  user: User;

  @OneToOne(() => Image, (image) => image.certificate, { nullable: false })
  @JoinColumn()
  image: Image;
}
