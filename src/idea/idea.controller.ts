import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDTO } from './idea.dto';

@Controller('idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}

  @Get()
  showAll() {
    return this.ideaService.showAllIdeas();
  }

  @Post()
  store(@Body() data: IdeaDTO) {
    return this.ideaService.createIdea(data);
  }

  @Get(':id')
  show(@Param('id') id: number) {
    return this.ideaService.getIdeaById(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: Partial<IdeaDTO>) {
    return this.ideaService.updateIdeaById(id, data);
  }

  @Delete(':id')
  destroy(@Param('id') id: number) {
    return this.ideaService.deleteIdeaById(id);
  }
}
