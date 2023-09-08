import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { RefreshAccessTokenDto } from 'src/modules/auth/dtos/refresh-access-token.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { RegisterNewUserInput } from 'src/modules/user/dtos/register-new-user.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Create user',
  })
  async registerNewUser(@Body() input: RegisterNewUserInput) {
    // this.logger.log(ctx, `${this.requestMailOtp.name} was called`);

    return await this.authService.registerNewUser(input);
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/refresh-access-token')
  @ApiOperation({
    summary: 'Retrieve new access and refresh token',
  })
  @ApiBody({
    type: RefreshAccessTokenDto,
  })
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
  ) {
    return await this.authService.refreshAccessToken(refreshAccessTokenDto);
  }
}
