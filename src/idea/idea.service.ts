import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from './idea.dto';
import { User } from 'src/user/user.entity';
import { IdeaResponse } from './idea.response';
import { VOTES } from './vote.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private toResponseObject(idea: Idea): IdeaResponse {
    const author = idea.author ? idea.author.toUserResponse(false) : null;
    const response = idea.toResponseObject();
    return { ...response, author };
  }

  private isOwner(idea: Idea, userId: number) {
    if (idea.author.id !== userId) {
      throw new HttpException(
        'You are not allowed to tweak was is not yours',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async vote(idea: Idea, user: User, vote: VOTES) {
    if (vote === VOTES.UP) {
      idea.downvotes = idea.downvotes.filter(
        downvote => downvote.id !== user.id,
      );

      const alreadyVotedByUser =
        idea.upvotes.filter(upvote => upvote.id === user.id).length > 0;

      if (alreadyVotedByUser) {
        idea.upvotes = idea.upvotes.filter(upvote => upvote.id !== user.id);
      } else {
        idea.upvotes = [...idea.upvotes, user];
      }
    } else {
      idea.upvotes = idea.upvotes.filter(downvote => downvote.id !== user.id);

      const alreadyVotedByUser =
        idea.downvotes.filter(upvote => upvote.id === user.id).length > 0;

      if (alreadyVotedByUser) {
        idea.downvotes = idea.downvotes.filter(upvote => upvote.id !== user.id);
      } else {
        idea.downvotes = [...idea.downvotes, user];
      }
    }

    await this.ideaRepository.save(idea);
    return idea.toResponseObject();
  }

  async showAllIdeas(): Promise<IdeaResponse[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes'],
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
      relations: ['author', 'upvotes', 'downvotes'],
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

  async bookmarkIdea(id: number, userId: number) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    const bookmarkExist =
      user.bookmarks.filter(bookmark => idea.id === bookmark.id).length > 0;

    if (bookmarkExist) {
      throw new HttpException(
        'Idea was already been bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.bookmarks = [...user.bookmarks, idea];
    await this.userRepository.save(user);

    return user.toUserResponse();
  }

  async unbookmarkIdea(id: number, userId: number) {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });

    user.bookmarks = user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
    await this.userRepository.save(user);

    return user.toUserResponse();
  }

  async upvoteIdea(id: number, userId: number) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return this.vote(idea, user, VOTES.UP);
  }

  async downvoteIdea(id: number, userId: number) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['upvotes', 'downvotes'],
    });
    const user = await this.userRepository.findOne({ where: { id: userId } });

    return this.vote(idea, user, VOTES.DOWN);
  }
}
