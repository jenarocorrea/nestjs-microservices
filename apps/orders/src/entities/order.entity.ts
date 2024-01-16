import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  details: string;

  @Column()
  userId: number;

  @Column({ length: 100 })
  shippingAddress: string;
}
