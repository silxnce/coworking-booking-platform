import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Room } from './room.entity';
import { User } from './user.entity';

const statusEnum = ['confirmed', 'cancelled'] as const;

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Room, { nullable: false, onDelete: 'CASCADE' })
  room: Room;

  @Column({ nullable: false, type: 'timestamp' })
  start_time: Date;

  @Column({ nullable: false, type: 'timestamp' })
  end_time: Date;

  @Column({
    type: 'enum',
    enum: statusEnum,
    nullable: false,
    default: 'confirmed',
  })
  status: (typeof statusEnum)[number];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
