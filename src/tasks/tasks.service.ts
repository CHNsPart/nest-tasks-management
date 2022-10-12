import { User } from './../auth/user.entity';
import { Repository } from 'typeorm';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
/* import { TaskRepository } from './task.repository'; */
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
    private logger = new Logger("TaskService")
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

        try {
            const tasks = await query.getMany()
            return tasks
        } catch (error) {
            this.logger.error(`Failed to get tasks for user ${user.username}. Filters: ${JSON.stringify(filterDTO)}`, error.stack)
            throw new InternalServerErrorException()
        }

        
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

        try {
            await task.save()
        } catch (error) {
            this.logger.error(`Failed to create a task for user ${user.username}. Data: ${JSON.stringify(createDTO)}`,error.stack)
            throw new InternalServerErrorException()
        }
        delete task.user

        return task
    }  

    getTaskById(
        id: number,
        user: User
    ): Promise<Task> {
        const found = this.taskRepository.findOne({ where: {id, userId: user.id} });
        if(!found) {
            throw new NotFoundException(`Task with ID ${id} not found!`)
        } else {
            return found
        }
    }

    async deleteTask(
        id: number,
        user: User,
    ): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id })
        
        if(result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found!`)
        }
    }

    async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTaskById(id, user)
        task.status = status
        await task.save()
        return task
    }
}
