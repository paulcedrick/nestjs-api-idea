import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { IdeaResponse } from './idea.response';
import { UserResponse } from 'src/user/user.response';

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
  author?: User;

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  upvotes?: User[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  downvotes?: User[];

  toResponseObject(): IdeaResponse {
    const {
      id,
      idea,
      author,
      createdAt,
      description,
      downvotes,
      updatedAt,
      upvotes,
    } = this;

    const response: IdeaResponse = {
      id,
      idea,
      createdAt,
      description,
      updatedAt,
    };

    if (downvotes) {
      response.downvotes = downvotes.map(downvote =>
        downvote.toResponseObject(false),
      );
    }

    if (upvotes) {
      response.upvotes = upvotes.map(upvote => upvote.toResponseObject(false));
    }

    if (author) {
      response.author = author.toResponseObject(false);
    }

    return response;
  }
}
