import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private taskService: TasksService) {}

    // @Get()
    // getAllTasks(@Query(ValidationPipe) filterDTO: GetTaskFilterDTO): Task[] {
    //     if (Object.keys(filterDTO).length) {
    //         return this.taskService.getTasksWithFilters(filterDTO)
    //     } else {
    //         return this.taskService.getAllTasks()
    //     }
    // }

    @Get("/:id")
    getTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
       return this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createDTO:CreateDTO): Promise<Task> {
        return this.taskService.createTask(createDTO)
    }

    @Delete("/:id")
    deleteTask(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.taskService.deleteTask(id)
    }

    // @Patch("/:id/status")
    // updateTaskStatus(
    //     @Param("id") id: string,
    //     @Body("status", TaskStatusValidationPipe) status: TaskStatus
    // ): Task {
    //     return this.taskService.updateTaskStatus(id, status)
    // }
}
