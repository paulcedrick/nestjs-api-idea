import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('idea')
export class Idea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  idea: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.ideas)
  author: User;
}
