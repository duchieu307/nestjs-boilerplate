import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/shared/configs/auth.config';
import { UserEntity } from 'src/database/entities/user.entity';
import { exceptions } from 'src/shared/exceptions';
import { JwtPayload } from 'src/shared/decorators/jwt-payload.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessTokenSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.getUserById(payload.userId);
    if (!user) {
      throw new HttpException(
        exceptions.authException.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
