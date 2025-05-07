/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    return await this.send('create-booking', { userId, createBookingDto });
  }

  async getBookings(userId: string) {
    return await this.send('get-bookings', userId);
  }

  async deleteBooking(userId: string, bookingId: string) {
    return await this.send('delete-booking', { userId, bookingId });
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
