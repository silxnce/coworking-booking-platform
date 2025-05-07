/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { UserGuard } from '../user/user.guard';
import { CreateBookingDto } from './dto/create-booking.dto';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create new booking' })
  @UseGuards(UserGuard)
  async createBooking(
    @Req() request: Request,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return await this.bookingService.createBooking(
      request['user'].id,
      createBookingDto,
    );
  }

  @Get(':userId')
  @ApiOperation({ summary: "Get all user's bookings" })
  async getBookings(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return await this.bookingService.getBookings(userId);
  }

  @Delete(':bookingId')
  @ApiOperation({ summary: 'Delete booking by ID' })
  @UseGuards(UserGuard)
  async deleteBooking(
    @Req() request: Request,
    @Param('bookingId', new ParseUUIDPipe()) bookingId: string,
  ) {
    return await this.bookingService.deleteBooking(
      request['user'].id,
      bookingId,
    );
  }
}
