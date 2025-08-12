import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class WeatherWarning {
  @PrimaryColumn({ unique: true })
  code: string;

  @Column({ nullable: false })
  isActive: boolean;
}
