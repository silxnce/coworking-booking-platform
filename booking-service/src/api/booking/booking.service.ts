import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AvailableSlot } from './entities/available-slot.entity';
import { Room } from './entities/room.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(AvailableSlot)
    private availableSlotRepository: Repository<AvailableSlot>,
  ) {}

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        user: { id: userId },
        start_time: createBookingDto.start_time,
        end_time: createBookingDto.end_time,
        status: 'confirmed',
      },
    });

    if (existingBooking) {
      throw new ConflictException(
        'You already have a booking for this time slot.',
      );
    }

    const slot = await this.availableSlotRepository.findOne({
      where: {
        room: { id: createBookingDto.roomId },
        is_available: true,
        start_time: createBookingDto.start_time,
        end_time: createBookingDto.end_time,
      },
    });

    if (!slot) {
      throw new NotFoundException(
        `No slots available for this time in chosen room`,
      );
    }

    slot.is_available = false;
    await this.availableSlotRepository.save(slot);

    const booking = this.bookingRepository.create({
      user: { id: userId },
      room: { id: createBookingDto.roomId },
      start_time: createBookingDto.start_time,
      end_time: createBookingDto.end_time,
    });

    return await this.bookingRepository.save(booking);
  }

  async getBookings(userId: string) {
    return await this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['room'],
      order: { start_time: 'DESC' },
    });
  }

  async deleteBooking(userId: string, bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { user: { id: userId }, id: bookingId, status: 'confirmed' },
    });

    if (!booking) {
      throw new NotFoundException(
        `Booking with such ID doesn't exist or already cancelled.`,
      );
    }

    booking.status = 'cancelled';

    const slot = await this.availableSlotRepository.findOne({
      where: {
        room: booking.room,
        is_available: false,
        start_time: booking.start_time,
        end_time: booking.end_time,
      },
    });

    if (slot) {
      slot.is_available = true;
      await this.availableSlotRepository.save(slot);
    }

    return await this.bookingRepository.save(booking);
  }
}
