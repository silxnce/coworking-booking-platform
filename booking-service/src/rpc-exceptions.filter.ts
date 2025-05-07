import {
  Catch,
  RpcExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(HttpException)
export class RpcExceptionsFilter implements RpcExceptionFilter<HttpException> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch(exception: HttpException, host: ArgumentsHost): Observable<any> {
    const status = exception.getStatus();
    const response = exception.getResponse();

    const payload = {
      status,
      message: response,
    };

    return throwError(() => new RpcException(payload));
  }
}
