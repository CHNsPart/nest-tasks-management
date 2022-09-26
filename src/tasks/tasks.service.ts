import { CreateDTO } from './dto/create-task.dto';
import { Task, TaskStatus } from './task.model';
import { Injectable } from '@nestjs/common';
import {v4 as uuid} from "uuid"

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks
    }

    getTaskById(id: string): Task {
        return this.tasks.find(task => task.id === id)
    }

    createTask(createDTO: CreateDTO): Task {
        const { title, description } = createDTO
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN
        }
        this.tasks.push(task)
        return task
    }
}
