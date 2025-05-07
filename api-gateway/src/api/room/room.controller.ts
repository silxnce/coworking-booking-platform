/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { AdminGuard } from '../user/admin.guard';
import { UserGuard } from '../user/user.guard';

@ApiTags('Room')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create new room/workspace (ADMIN only)' })
  @UseGuards(UserGuard, AdminGuard)
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomService.createRoom(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get existing rooms' })
  async getRooms() {
    return await this.roomService.getRooms();
  }

  @Get(':id/slots')
  @ApiOperation({ summary: 'Get time slots for room' })
  async getSlots(@Param('id', new ParseUUIDPipe()) roomId: string) {
    return await this.roomService.getSlots(roomId);
  }
}
