import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { RoomModule } from './api/room/room.module';
import { BookingModule } from './api/booking/booking.module';

@Module({
  imports: [UserModule, RoomModule, BookingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
