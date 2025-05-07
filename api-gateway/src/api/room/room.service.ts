/* eslint-disable @typescript-eslint/no-unsafe-return */
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, TimeoutError, firstValueFrom } from 'rxjs';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomService {
  constructor(@Inject('ROOM_SERVICE') private client: ClientProxy) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    return await this.send('create-room', createRoomDto);
  }

  async getRooms() {
    return await this.send('get-rooms', {});
  }

  async getSlots(roomId: string) {
    return await this.send('get-slots', roomId);
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
