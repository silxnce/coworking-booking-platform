import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class AvailableSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, { nullable: false, onDelete: 'CASCADE' })
  room: Room;
}
