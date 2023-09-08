import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { jwtConstants } from 'src/shared/configs/auth.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.accessTokenSecret,
      signOptions: { expiresIn: jwtConstants.accessTokenExpiry },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, JwtStrategy, UserRepository],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
