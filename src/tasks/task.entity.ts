import { User } from './../auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    description: string;
    
    @Column()
    status: TaskStatus;

    @ManyToOne(type => User, user => user.tasks, { eager: false })
    user: User
}  