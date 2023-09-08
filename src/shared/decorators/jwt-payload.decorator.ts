import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import jwtDecode from 'jwt-decode';
import { exceptions } from 'src/shared/exceptions';

export class JwtPayload {
  userId: number;
  iat?: string;
  exp?: string;
}

export const GetJwtPayload = createParamDecorator(
  (data: string, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization;
      const payload: JwtPayload = jwtDecode(token);
      return payload;
    } catch (e) {
      throw new HttpException(
        exceptions.authException.UNAUTHORIZED,
        HttpStatus.BAD_REQUEST,
      );
    }
  },
);
