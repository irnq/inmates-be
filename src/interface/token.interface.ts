import { IUser } from './user.interface';

export interface IToken {
  user: IUser;
  refreshToken: string;
}
