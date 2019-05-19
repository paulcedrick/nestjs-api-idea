import { UserResponse } from 'src/user/user.response';

export class IdeaResponse {
  id?: number;
  updatedAt: Date;
  createdAt: Date;
  idea: string;
  description: string;
  author?: UserResponse;
  upvotes?: UserResponse[];
  downvotes?: UserResponse[];
}
