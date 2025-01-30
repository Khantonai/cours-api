import { UUID } from 'crypto';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/users.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ nullable: false })
  imageUrl: string;

  @Column({ nullable: false })
  modifiedImageUrl: string;

  @Column({ nullable: false, default: 0 })
  view: number;

  @ManyToOne(() => User, (user) => user.images, { nullable: false })
  user: User;
}
