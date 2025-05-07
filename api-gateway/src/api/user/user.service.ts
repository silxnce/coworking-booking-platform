/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async register(registerUserDto: RegisterUserDto) {
    return await this.send('register', registerUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    return await this.send('login', loginUserDto);
  }

  async validateAccessToken(token: string) {
    return await this.send('validate-access-token', token);
  }

  private async send(pattern: string, data: any): Promise<any> {
    if (!pattern) {
      throw new Error('Pattern is undefined!');
    }

    const res$ = this.client.send(pattern, data).pipe(
      timeout(30_000),
      catchError((err: any) => {
        if (err instanceof TimeoutError) {
          throw new HttpException('Service timeout', 504);
        }

        const raw = err.error ?? err;
        const status = typeof raw.status === 'number' ? raw.status : 502;

        let message = raw.message;
        if (message && typeof message === 'object' && 'message' in message) {
          message = message.message;
        }
        message = message ?? 'Unknown service error';

        throw new HttpException(message, status);
      }),
    );

    const result = await firstValueFrom(res$);
    return result == null ? null : result;
  }
}
