import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  details: string;

  @Column()
  userId: number;

  // Otras columnas como estado del pedido, fecha, etc., pueden ser añadidas aquí.
}
