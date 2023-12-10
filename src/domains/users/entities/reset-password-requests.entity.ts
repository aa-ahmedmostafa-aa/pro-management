import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity("reset_passwords_requests")
export class ResetPasswordsRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    seed!: string;

    @Column()
    userId!: number;

    @Column()
    @CreateDateColumn()
    creationDate!: Date;

    @Column()
    @UpdateDateColumn()
    modificationDate!: Date;
}