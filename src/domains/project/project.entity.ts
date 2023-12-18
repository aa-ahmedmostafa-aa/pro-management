import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "../users/entities/user.entity";
import { Task } from "../task/task.entity";

@Entity("project")
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
  manager!: User;

  @OneToMany(() => Task, (task) => task.project, {
    cascade: true,
  })
  task!: Task;
}
