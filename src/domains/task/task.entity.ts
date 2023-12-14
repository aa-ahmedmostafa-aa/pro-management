import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { Project } from "../project/project.entity";
import { User } from "../users/entities/user.entity";
import { TaskStatus } from "../../shared/enums/task-status";

@Entity("task")
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    default: TaskStatus.ToDo,
  })
  status!: string;

  @Column()
  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  @UpdateDateColumn()
  modificationDate!: Date;

  @ManyToOne(() => Project, (project) => project.task, {
    onDelete: "CASCADE",
  })
  project!: Project;

  @ManyToOne(() => User, (employee) => employee.task, {
    onDelete: "CASCADE",
  })
  employee!: User;
}
