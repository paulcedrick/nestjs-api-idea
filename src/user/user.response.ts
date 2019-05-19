import { IdeaResponse } from 'src/idea/idea.response';

export class UserResponse {
  id: number;
  username: string;
  token?: string;
  bookmarks?: IdeaResponse[];
  ideas?: IdeaResponse[];
}
