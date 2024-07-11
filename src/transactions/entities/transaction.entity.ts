import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string;

  @Column()
  parkingSpaceId: string;

  @Column()
  entryTime: Date;

  @Column()
  exitTime: Date;
}
