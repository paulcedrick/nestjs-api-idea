import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const SALT = 10;

export interface ResponseObj {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
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

  toResponseObject(showToken: boolean = true) {
    const { id, createdAt, username, updatedAt, token } = this;
    const responseObject: ResponseObj = { id, createdAt, username, updatedAt };
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
