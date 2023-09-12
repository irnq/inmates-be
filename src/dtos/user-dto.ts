import { IUser } from '../interface/user.interface';

export class UserDTO {
  id: string;
  nickname: string;
  isActivated: boolean;

  constructor(user: IUser) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.isActivated = user.isActivated;
  }
}
