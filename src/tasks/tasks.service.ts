import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
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

    getTasksWithFilters(filterDTO: GetTaskFilterDTO): Task[] {
       
        const { status, search } = filterDTO
        let tasks = this.getAllTasks()

        if (status) {
            tasks = tasks.filter( task => task.status === status)
        }
        if (search) {
            tasks = tasks.filter(
                task => task.title.includes(search) 
                || 
                task.description.includes(search)
            )
        }

        return tasks
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

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id)
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id)
        task.status = status
        return task
    }
}
