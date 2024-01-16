import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  details: string;

  @Column()
  userId: number;

  @Column()
  shippingAddress: string;
}
