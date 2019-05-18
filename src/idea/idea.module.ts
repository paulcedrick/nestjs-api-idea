import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './idea.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
