import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvailableSlot } from './entities/available-slot.entity';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(AvailableSlot)
    private availableSlotRepository: Repository<AvailableSlot>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto) {
    const room = this.roomRepository.create(createRoomDto);
    const savedRoom = await this.roomRepository.save(room);

    await this.generateSlotsForRoom(savedRoom);
    return savedRoom;
  }

  async getRooms() {
    return await this.roomRepository.find();
  }

  async getSlots(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId, availableSlots: { is_available: true } },
      relations: ['availableSlots'],
    });
    if (!room) {
      throw new NotFoundException(
        `Room ${roomId} doesn't exist or has no available slots`,
      );
    }

    return room;
  }

  private async generateSlotsForRoom(room: Room): Promise<void> {
    const slots: AvailableSlot[] = [];
    const baseDate = new Date();
    baseDate.setMinutes(0, 0, 0);

    for (let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++) {
      for (let seat = 0; seat < room.capacity; seat++) {
        const start = new Date(baseDate);
        start.setHours(hour);
        const end = new Date(baseDate);
        end.setHours(hour + 1);

        const slot = this.availableSlotRepository.create({
          room,
          start_time: start,
          end_time: end,
          is_available: true,
        });
        slots.push(slot);
      }
    }

    await this.availableSlotRepository.save(slots);
  }
}
