import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Idea } from 'src/idea/idea.entity';
import { IdeaResponse } from 'src/idea/idea.response';
import { UserResponse } from './user.response';

const SALT = 10;

export interface ResponseObj {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  ideas?: IdeaResponse[];
  bookmarks?: IdeaResponse[];
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    unique: true,
  })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT);
  }

  @OneToMany(() => Idea, idea => idea.author)
  ideas?: Idea[];

  @ManyToMany(() => Idea, { cascade: true })
  @JoinTable()
  bookmarks?: Idea[];

  toUserResponse(showToken: boolean = false): UserResponse {
    const { id, ideas, bookmarks, username, token } = this;

    const response: UserResponse = { id, username }

    if (ideas) {
      response.ideas = ideas.map((item) => item.toResponseObject());
    }

    if (bookmarks) {
      response.bookmarks = bookmarks.map((item) => item.toResponseObject());
    }

    if (showToken) {
      response.token = token;
    }

    return response;
  }

  toResponseObject(showToken: boolean = true): ResponseObj {
    const {
      id,
      createdAt,
      username,
      updatedAt,
      token,
      ideas,
      bookmarks,
    } = this;
    const response: ResponseObj = { id, createdAt, username, updatedAt };

    if (ideas) {
      response.ideas = ideas.map(idea => idea.toResponseObject());
    }

    if (bookmarks) {
      response.bookmarks = bookmarks.map(idea => idea.toResponseObject());
    }

    if (showToken) {
      response.token = token;
    }

    return response;
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  private get token() {
    const { id, username } = this;
    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}
