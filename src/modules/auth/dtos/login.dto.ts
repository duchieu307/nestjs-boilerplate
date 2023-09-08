import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'example@gmail.com',
  })
  @MinLength(6)
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;
}
