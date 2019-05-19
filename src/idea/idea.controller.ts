import { Controller, Get, Post, Patch, Delete, Body, Param, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { userInfo } from 'os';

@Controller('/api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAll() {
    return this.ideaService.showAllIdeas();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  store(@User('id') userId: number, @Body() data: IdeaDTO) {
    return this.ideaService.createIdea(data, userId);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.ideaService.getIdeaById(id);
  }

  @Patch(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  update(@User('id') userId, @Param('id') id: number, @Body() data: Partial<IdeaDTO>) {
    return this.ideaService.updateIdeaById(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  destroy(@User('id') userId: number, @Param('id') id: number) {
    return this.ideaService.deleteIdeaById(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmark(@User('id') userId: number, @Param('id') id: number) {
    return this.ideaService.bookmarkIdea(id, userId);
  }

  @Delete(':id/bookmark/')
  @UseGuards(new AuthGuard())
  unbookmark(@User('id') userId: number, @Param('id') id: number) {
    return this.ideaService.unbookmarkIdea(id, userId);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvote(@User('id') userId: number, @Param('id') id: number) {
    return this.ideaService.upvoteIdea(id, userId);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvote(@User('id') userId: number, @Param('id') id: number) {
    return this.ideaService.downvoteIdea(id, userId);
  }
}
