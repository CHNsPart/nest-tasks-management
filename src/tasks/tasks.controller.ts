import { CreateDTO } from './dto/create-task.dto';
import { Task } from './task.model';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getAllTasks(): Task[] {
       return this.taskService.getAllTasks()
    }

    @Get("/:id")
    getTaskById(@Param("id") id: string): Task {
       return this.taskService.getTaskById(id)
    }

    @Post()
    createTask(@Body() createDTO:CreateDTO): Task {
        return this.taskService.createTask(createDTO)
    }
}
