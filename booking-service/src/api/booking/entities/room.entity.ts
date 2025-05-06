import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { AvailableSlot } from './available-slot.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  capacity: number;

  @Column({ nullable: false })
  type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => AvailableSlot, (availableSlot) => availableSlot.room)
  availableSlots: AvailableSlot[];
}
