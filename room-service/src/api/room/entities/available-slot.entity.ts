import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class AvailableSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, { nullable: false, onDelete: 'CASCADE' })
  room: Room;

  @Column({ nullable: false, type: 'timestamp' })
  start_time: Date;

  @Column({ nullable: false, type: 'timestamp' })
  end_time: Date;

  @Column({ default: true })
  is_available: boolean;
}
