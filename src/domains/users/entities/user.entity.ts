import { Project } from "../../project/project.entity";
import { UserGroup } from "../../user-group/user-group.entity";
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userName!: string;

  @Column({ nullable: true })
  imagePath!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  country!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  verificationCode!: string;

  @Column({ default: false })
  isVerified!: boolean;

  @Column({ default: true })
  isActivated!: boolean;

  @Column()
  @CreateDateColumn()
  creationDate!: Date;

  @Column()
  @UpdateDateColumn()
  modificationDate!: Date;

  @ManyToOne(() => UserGroup, (userGroup) => userGroup.users, {
    cascade: true,
  })
  group!: UserGroup;

  @OneToMany(() => Project, (Project) => Project.admin, {
    onDelete: "CASCADE",
  })
  project!: Project;
}
