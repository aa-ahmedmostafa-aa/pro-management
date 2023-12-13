import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  @UpdateDateColumn()
  modificationDate!: Date;

  @ManyToOne(() => User, (user) => user.project, {
    cascade: true,
  })
  admin!: User;
}

