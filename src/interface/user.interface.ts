export interface IUser {
  id: string;
  name: string;
  nickname: string;
  birthday: string;
  email: string;
  password: string;
  city: string;
  isActivated: boolean;
  activationLink: string;
}

export type IUserDTO = Pick<IUser, 'id' | 'nickname' | 'isActivated'>;

export type UserRegistrationParams = {
  name: string;
  nickname: string;
  birthday: string;
  email: string;
  password: string;
  city: string;
};
