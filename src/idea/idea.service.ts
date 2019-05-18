import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';
import { User } from 'src/user/user.entity';
import { IdeaResponse } from './idea.response';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private toResponseObject(idea: Idea): IdeaResponse {
    const author = idea.author ? idea.author.toResponseObject(false) : null;
    return { ...idea, author };
  }

  private isOwner(idea: Idea, userId: number) {
    if (idea.author.id !== userId) {
      throw new HttpException(
        'You are not allowed to tweak was is not yours',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async showAllIdeas(): Promise<IdeaResponse[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author'],
    });

    return ideas.map(idea => this.toResponseObject(idea));
  }

  async createIdea(data: IdeaDTO, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async getIdeaById(id: number): Promise<IdeaResponse> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return this.toResponseObject(idea);
  }

  async updateIdeaById(
    id: number,
    userId: number,
    data: Partial<IdeaDTO>,
  ): Promise<IdeaResponse> {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    this.isOwner(idea, userId);

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({ id });
    return this.toResponseObject(idea);
  }

  async deleteIdeaById(id: number, userId: number) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    this.isOwner(idea, userId);

    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    await this.ideaRepository.delete({ id });
    return this.toResponseObject(idea);
  }
}
