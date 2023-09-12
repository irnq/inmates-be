import { IUser, IUserDTO, UserRegistrationParams } from '../interface/user.interface';
import bcrypt from 'bcryptjs';

import Harper from './harper';
const harper = new Harper();

import TokenService from './token-service';
const tokenService = new TokenService();

import MailService from './mail-service';
const mailService = new MailService();

import { ApiError } from '../exceptions/api-error';
import { UserDTO } from '../dtos/user-dto';

const API_ACTIVATE_LINK = `${process.env.API_URL || 'website.link'}/api/activate/`;
const salt = parseInt(process.env.BCRYPT_SALT || '2');

class UserService {
  async registration({ nickname, email, password, birthday, name, city }: UserRegistrationParams) {
    const candidate = await harper.findUser('email', email);
    if (candidate) {
      throw ApiError.BadRequest(`Email '${email}' is already registered`);
    }
    const usedName = await harper.findUser('nickname', nickname);
    if (usedName) {
      throw ApiError.BadRequest(`Nickname '${nickname}' is already registered`);
    }

    const hashPassword = await bcrypt.hash(password, salt);

    const user = await harper.createUser({ nickname, email, password: hashPassword, city, name, birthday });

    if (user) {
      await mailService.sendActivationMail(email, API_ACTIVATE_LINK + user.activationLink);

      return await this.generateTokensAndDTO(user);
    } else {
      throw ApiError.BadRequest(`An error occurred while creating a user`);
    }
  }

  async activate(activationLink: string) {
    const user = await harper.findUser('activationLink', activationLink);
    if (!user) {
      throw ApiError.BadRequest('Activation failed! Wrong activation link');
    }
    await harper.updateUserField(user.id, 'isActivated', true);
  }

  async login(email: string, password: string) {
    const user = await harper.findUser('email', email);
    if (!user) {
      throw ApiError.BadRequest(`Wrong email or password!`);
    }
    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      throw ApiError.BadRequest(`Wrong email or password!`);
    }

    return await this.generateTokensAndDTO(user);
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    console.log(userData);
    const tokenFromDb = await tokenService.findRefreshToken(refreshToken);
    console.log(tokenFromDb);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await harper.findUser('id', (<IUserDTO>userData).id);
    if (!user) {
      throw ApiError.BadRequest(`User doesn't exist anymore`);
    }

    return await this.generateTokensAndDTO(user);
  }

  async generateTokensAndDTO(user: IUser) {
    const userDTO: IUserDTO = new UserDTO(user);
    console.log('DTO');
    const tokens = tokenService.generateTokens({ ...userDTO });

    console.log('pre save');
    await tokenService.saveToken(user.id, tokens.refreshToken);
    console.log('after save');

    return {
      ...tokens,
      user: userDTO,
    };
  }

  async getAllUsers() {
    return await harper.getAllUsers();
  }
}

export default UserService;
