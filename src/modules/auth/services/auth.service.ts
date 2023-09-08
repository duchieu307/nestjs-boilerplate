import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { RegisterNewUserInput } from 'src/modules/user/dtos/register-new-user.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { plainToClass } from 'class-transformer';
import { UserEntity } from 'src/database/entities/user.entity';
import { compare, hash } from 'bcrypt';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { exceptions } from 'src/shared/exceptions';
import { JwtPayload } from 'src/shared/decorators/jwt-payload.decorator';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  AUTH_CACHE_PREFIX,
  jwtConstants,
} from 'src/shared/configs/auth.config';
import { RefreshAccessTokenDto } from 'src/modules/auth/dtos/refresh-access-token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly redisService: RedisService,
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async registerNewUser(input: RegisterNewUserInput) {
    const existedUser = await this.userRepository.checkUserExisted(input.email);

    if (existedUser) {
      throw new HttpException(
        exceptions.authException.ACCOUNT_ALREADY_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await hash(input.password, 10);

    const newUser = await this.userRepository.save(
      plainToClass(UserEntity, {
        email: input.email,
        hashPassword: hashPassword,
        fullName: input.fullName,
      }),
    );

    return newUser;
  }

  async login(loginDto: LoginDto) {
    let user: UserEntity;

    if (loginDto.email) {
      user = await this.userRepository.getUserByEmail(loginDto.email);
    }

    if (!user) {
      throw new HttpException(
        exceptions.authException.ACCOUNT_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }

    const match = await compare(loginDto.password, user.hashPassword);

    if (match) {
      const { accessToken } = this.generateAccessToken({
        userId: user.id,
      });
      const { refreshToken } = await this.generateRefreshToken(accessToken);

      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new HttpException(
        exceptions.authException.WRONG_USERNAME_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  generateAccessToken(payload: JwtPayload): { accessToken: string } {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async generateRefreshToken(
    accessToken: string,
  ): Promise<{ refreshToken: string }> {
    const refreshToken = uuidv4();
    const hashedAccessToken = createHash('sha256')
      .update(accessToken)
      .digest('hex');
    await this.redisService
      .getClient()
      .set(
        `${AUTH_CACHE_PREFIX}${refreshToken}`,
        hashedAccessToken,
        'EX',
        jwtConstants.refreshTokenExpiry,
      );
    return {
      refreshToken: refreshToken,
    };
  }

  async verifyAccessToken(
    accessToken: string,
  ): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(accessToken);
  }

  async decodeAccessToken(accessToken: string): Promise<JwtPayload> {
    return this.jwtService.decode(accessToken) as JwtPayload;
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const { refreshToken, accessToken } = refreshAccessTokenDto;
    const oldHashAccessToken = await this.redisService
      .getClient()
      .get(`${AUTH_CACHE_PREFIX}${refreshToken}`);
    if (!oldHashAccessToken)
      throw new HttpException(
        exceptions.authException.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );

    const hashAccessToken = createHash('sha256')
      .update(accessToken)
      .digest('hex');
    if (hashAccessToken == oldHashAccessToken) {
      const oldPayload = await this.decodeAccessToken(accessToken);
      delete oldPayload.iat;
      delete oldPayload.exp;
      const newAccessToken = this.generateAccessToken(oldPayload);
      const newRefreshToken = await this.generateRefreshToken(
        newAccessToken.accessToken,
      );
      await this.redisService
        .getClient()
        .del(`${AUTH_CACHE_PREFIX}${refreshToken}`);
      return {
        ...newAccessToken,
        ...newRefreshToken,
      };
    } else
      throw new HttpException(
        exceptions.authException.REFRESH_TOKEN_EXPIRED,
        HttpStatus.BAD_REQUEST,
      );
  }
}
