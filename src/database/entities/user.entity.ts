import { Field } from 'mysql2';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 75 })
  email: string;

  @Column('varchar', { name: 'full_name' })
  fullName: string;

  @Column({
    name: 'hash_password',
  })
  hashPassword: string;

  @Column()
  status: string;

  @Column({
    name: 'user_type',
  })
  userType: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
}
