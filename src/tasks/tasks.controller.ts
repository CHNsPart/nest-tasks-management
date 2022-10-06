import { User } from './../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService) {}

    @Get()
    getAllTasks(@Query(ValidationPipe) filterDTO: GetTaskFilterDTO): Promise<Task[]> {
        return this.taskService.getTasks(filterDTO)
    }

    @Get("/:id")
    getTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
       return this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createDTO:CreateDTO,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.createTask(createDTO, user)
    }

    @Delete("/:id")
    deleteTask(@Param("id", ParseIntPipe) id: number): Promise<void> {
        return this.taskService.deleteTask(id)
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body("status", TaskStatusValidationPipe) status: TaskStatus
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status)
    }
}
