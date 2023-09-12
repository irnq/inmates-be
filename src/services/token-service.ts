import jwt from 'jsonwebtoken';
import { IUser, IUserDTO } from '../interface/user.interface';

import Harper from './harper';
const harper = new Harper();

const ACCESS_KEY = process.env.JWT_ACCESS_SECRET || 'secret';
const REFRESH_KEY = process.env.JWT_ACCESS_SECRET || 'secret';

class TokenService {
  generateTokens(payload: IUserDTO) {
    const accessToken = jwt.sign(payload, ACCESS_KEY, { expiresIn: '20m' });
    const refreshToken = jwt.sign(payload, REFRESH_KEY, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    return await harper.saveToken(userId, refreshToken);
  }

  async removeToken(refreshToken: string) {
    return harper.deleteRefreshToken(refreshToken);
  }

  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, ACCESS_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, REFRESH_KEY);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findRefreshToken(token: string) {
    return harper.findRefreshToken(token);
  }
}

export default TokenService;
