import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.FORBIDDEN,
      );
    }

    return user.toResponseObject();
  }

  async register(data: UserDTO) {
    const { username } = data;
    let user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async getAllUsers() {
    const users = await this.userRepository.find({ relations: ['ideas', 'bookmarks'] });
    return users.map(user => user.toResponseObject(false));
  }
}
