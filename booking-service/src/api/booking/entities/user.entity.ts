import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

const roleEnum = ['USER', 'ADMIN'] as const;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: roleEnum,
    nullable: false,
    default: 'USER',
  })
  role: (typeof roleEnum)[number];

  @Exclude()
  @Column({ nullable: false })
  passwordHash: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
