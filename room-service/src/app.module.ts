import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './api/room/room.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [RoomModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
