import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Idea } from 'src/idea/idea.entity';

const SALT = 10;

export interface ResponseObj {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  ideas?: Idea[],
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
  ideas: Idea[];

  toResponseObject(showToken: boolean = true) {
    const { id, createdAt, username, updatedAt, token, ideas } = this;
    const responseObject: ResponseObj = { id, createdAt, username, updatedAt };
    responseObject.ideas = ideas || [];
    if (showToken) {
      responseObject.token = token;
    }
    return responseObject;
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
