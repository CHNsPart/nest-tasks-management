import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { Task, TaskStatus } from './task.model';
import { Injectable, NotFoundException } from '@nestjs/common';
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
        const found = this.tasks.find(task => task.id === id)
        if(!found){
            throw new NotFoundException(`Task with ID : ${id} not found! 🚗`)
        }
        return found
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
        const found = this.getTaskById(id)
        this.tasks = this.tasks.filter(task => task.id !== found.id)
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id)
        task.status = status
        return task
    }
}
