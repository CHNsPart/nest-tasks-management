import { Repository } from 'typeorm';
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
        private taskRepository: Repository<Task>
     ) {}

    async createTask(createDTO: CreateDTO): Promise<Task> {
         const { title, description } = createDTO

        const task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        await task.save()

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
        console.log(result)
    }
}
