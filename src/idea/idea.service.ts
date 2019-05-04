import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
  ) {}

  async showAllIdeas() {
    return await this.ideaRepository.find();
  }

  async createIdea(data: IdeaDTO) {
    const idea = await this.ideaRepository.create(data);
    await this.ideaRepository.save(idea);

    return idea;
  }

  async getIdeaById(id: number) {
    return await this.ideaRepository.findOne({ where: { id } });
  }

  async updateIdeaById(id: number, data: Partial<IdeaDTO>) {
    await this.ideaRepository.update({ id }, data);
    return await this.ideaRepository.findOne({ id });
  }

  async deleteIdeaById(id: number) {
    await this.ideaRepository.delete({ id });
    return { deleted: true };
  }
}
