/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  async register(dto: RegisterUserDto) {
    return this.send('register', dto);
  }

  async login(dto: LoginUserDto) {
    return this.send('login', dto);
  }

  async validateAccessToken(token: string) {
    return this.send('validate-access-token', token);
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
          message = (message as any).message;
        }
        message = message ?? 'Unknown service error';

        throw new HttpException(message, status);
      }),
    );

    const result = await firstValueFrom(res$);
    return result == null ? null : result;
  }
}
