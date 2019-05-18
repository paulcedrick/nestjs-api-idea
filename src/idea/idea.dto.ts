import { IsString, IsEmpty, IsNotEmpty, IsOptional } from 'class-validator';
import { UserResponse } from 'src/user/user.response';

export class IdeaDTO {
  @IsString()
  @IsNotEmpty()
  idea: string;

  @IsString()
  @IsOptional()
  description: string;
}