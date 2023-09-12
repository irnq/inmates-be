import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../exceptions/api-error';
import { IUser, IUserDTO } from '../interface/user.interface';
import TokenService from '../services/token-service';
const tokenService = new TokenService();

interface TypedRequest extends Request {
  user: IUserDTO;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    (<TypedRequest>req).user = <IUserDTO>userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
