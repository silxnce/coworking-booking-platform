import { Controller } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern('create-booking')
  async createBooking(
    @Payload()
    {
      userId,
      createBookingDto,
    }: {
      userId: string;
      createBookingDto: CreateBookingDto;
    },
  ) {
    return await this.bookingService.createBooking(userId, createBookingDto);
  }

  @MessagePattern('get-bookings')
  async getBookings(@Payload() userId: string) {
    return await this.bookingService.getBookings(userId);
  }

  @MessagePattern('delete-booking')
  async deleteBooking(
    @Payload() { userId, bookingId }: { userId: string; bookingId: string },
  ) {
    return await this.bookingService.deleteBooking(userId, bookingId);
  }
}
