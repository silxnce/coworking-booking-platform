import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('register')
  async register(@Payload() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @MessagePattern('login')
  async login(@Payload() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @MessagePattern('validate-access-token')
  validateAccessToken(@Payload() token: string) {
    return this.userService.validateAccessToken(token);
  }
}
