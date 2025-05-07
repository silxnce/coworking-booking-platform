import { Controller } from '@nestjs/common';
import { RoomService } from './room.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @MessagePattern('create-room')
  async createRoom(@Payload() createRoomDto: CreateRoomDto) {
    return await this.roomService.createRoom(createRoomDto);
  }

  @MessagePattern('get-rooms')
  async getRooms() {
    return await this.roomService.getRooms();
  }

  @MessagePattern('get-slots')
  async getSlots(@Payload() roomId: string) {
    return await this.roomService.getSlots(roomId);
  }
}
