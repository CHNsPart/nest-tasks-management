import { User } from './../auth/user.entity';
import { EntityManager, Repository } from 'typeorm';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    constructor( 
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
     ) {}

    async getTasks(
        filterDTO: GetTaskFilterDTO,
        user: User
        ): Promise<Task[]> {
        const { status, search } = filterDTO
        const query = this.taskRepository.createQueryBuilder('task')

        query.where('task.userId = :userId', { userId: user.id })
        
        if(status) {
            query.andWhere('task.status = :status', { status })
        }
        if(search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)',
            { search: `%${search}%` })
        }

        const tasks = await query.getMany()
        return tasks
    }

    async createTask(
        createDTO: CreateDTO,
        user: User
    ): Promise<Task> {
        const { title, description } = createDTO

        const task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()
        delete task.user

        return task
    }  

    getTaskById(id: number): Promise<Task> {
        const found = this.taskRepository.findOneBy({ id });
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found!`)
        } else {
            return found
        }
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id)
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found!`)
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id)
        task.status = status
        await task.save()
        return task
    }
}
