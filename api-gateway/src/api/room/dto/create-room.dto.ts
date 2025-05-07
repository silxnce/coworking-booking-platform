import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'name',
    required: true,
    description: "Room's name",
    type: String,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'location',
    required: true,
    description: "Room's location",
    type: String,
  })
  location: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    name: 'capacity',
    required: true,
    description: "Room's capacity",
    type: Number,
  })
  capacity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    name: 'type',
    required: true,
    description: "Room's type",
    type: String,
  })
  type: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    name: 'description',
    required: false,
    description: "Room's description",
    type: String,
  })
  description?: string;
}
