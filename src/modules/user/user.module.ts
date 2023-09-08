import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { SharedModule } from '../../shared/share.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserRepository])],
})
export class UserModule {}
