import { Controller, Get, Post, Patch, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';

@Controller('/api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAll() {
    return this.ideaService.showAllIdeas();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  store(@Body() data: IdeaDTO) {
    return this.ideaService.createIdea(data);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.ideaService.getIdeaById(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: number, @Body() data: Partial<IdeaDTO>) {
    return this.ideaService.updateIdeaById(id, data);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.ideaService.deleteIdeaById(id);
  }
}
