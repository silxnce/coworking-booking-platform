import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDate } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    name: 'roomId',
    required: true,
    description: 'ID of the room, slot of which is being booked',
    type: String,
    format: 'uuid',
  })
  roomId: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    name: 'start_time',
    required: true,
    description: 'The start of the booking',
    type: Date,
  })
  start_time: Date;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    name: 'end_time',
    required: true,
    description: 'The end of the booking',
    type: Date,
  })
  end_time: Date;
}
