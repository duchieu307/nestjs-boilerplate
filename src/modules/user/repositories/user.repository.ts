import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async checkUserExisted(email: string): Promise<boolean> {
    const existed = await this.find({
      where: [
        {
          email: email,
        },
      ],
    });
    if (existed) return true;
    return false;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = this.findOne({
      where: {
        email: email,
      },
    });
    return user;
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = this.findOne({
      where: {
        id: id,
      },
    });
    return user;
  }
}
