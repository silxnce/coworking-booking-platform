import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

const JWT_ACCESS_SECRET = 'accessSecret';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const candidate = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (candidate) {
      throw new ConflictException('User with such email already exists.');
    }

    const passwordHash = await bcrypt.hash(registerUserDto.password, 3);
    const user = this.userRepository.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      role: 'USER',
      passwordHash: passwordHash,
    });

    let savedUser;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User with this email already exists.');
      }
      throw error;
    }

    const userDto: UserDto = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    };

    const accessToken = jwt.sign(userDto, JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });

    return {
      accessToken,
      user: userDto,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new NotFoundException("User with such email doesn't exist.");
    }

    const isPassEquals = await bcrypt.compare(
      loginUserDto.password,
      user.passwordHash,
    );
    if (!isPassEquals) {
      throw new BadRequestException('The password is incorrect.');
    }

    const userDto: UserDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(userDto, JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });

    return {
      accessToken,
      user: userDto,
    };
  }

  validateAccessToken(token: string) {
    let userData;
    try {
      userData = jwt.verify(token, JWT_ACCESS_SECRET) as jwt.JwtPayload;
    } catch {
      throw new UnauthorizedException('You are not authorized.');
    }

    const userDto: UserDto = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    return userDto;
  }
}
