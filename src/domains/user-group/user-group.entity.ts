import { Role } from './../roles/roles.entity';
import { Entity, Column, ManyToMany, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany, JoinTable } from "typeorm";
import { User } from "../users/entities/user.entity";

@Entity("user_groups")
export class UserGroup {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    @CreateDateColumn()
    creationDate!: Date;

    @Column()
    @UpdateDateColumn()
    modificationDate!: Date;

    @OneToMany(() => User, (user) => user.group)
    users!: User[];

    @ManyToMany(() => Role, (role: Role) => role.groups, {
        cascade: true,
    })
    @JoinTable()
    roles!: Role[];
}