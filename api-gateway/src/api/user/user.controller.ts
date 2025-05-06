import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserGuard } from './user.guard';
import { UserDto } from './dto/user.dto';

const ACCESS_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create account' })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData: {
      accessToken;
      user: UserDto;
    } = await this.userService.register(registerUserDto);

    response.cookie('accessToken', userData.accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      // secure: true,
    });

    return userData;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to account' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData: {
      accessToken;
      user: UserDto;
    } = await this.userService.login(loginUserDto);

    response.cookie('accessToken', userData.accessToken, {
      maxAge: ACCESS_TOKEN_MAX_AGE,
      httpOnly: true,
      // secure: true,
    });

    return userData;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout from account' })
  @UseGuards(UserGuard)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('accessToken');
  }
}
