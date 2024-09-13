import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flavor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
