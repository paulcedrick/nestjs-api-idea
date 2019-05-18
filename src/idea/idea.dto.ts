import { IsString, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class IdeaDTO {
  @IsString()
  @IsNotEmpty()
  idea: string;

  @IsString()
  @IsOptional()
  description: string;
}
