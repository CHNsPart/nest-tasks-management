import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { User } from './../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe, Logger, DefaultValuePipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger("TasksController")
    constructor(private taskService: TasksService) {}


    // @Get()
    // getAllTasks(
    //     @Query(ValidationPipe) filterDTO: GetTaskFilterDTO,
    //     @GetUser() user: User
    // ): Promise<Task[]> {
    //     this.logger.verbose(`User ${user.username} retrieving all tasks. Filters ${JSON.stringify(filterDTO)}`)
    //     return this.taskService.getTasks(filterDTO, user)
    // }

    @Get()
    index(
        @Query(ValidationPipe) filterDTO: GetTaskFilterDTO,
        @GetUser() user: User,
        options: IPaginationOptions,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(2), ParseIntPipe) limit: number = 5,
    ): Promise<Pagination<Task>> {
        limit = limit > 5 ? 5 : limit;
        //this.logger.verbose(`User ${user.username} retrieving all tasks. Filters ${JSON.stringify(filterDTO)}`)
        return this.taskService.paginate({
            limit,
            page,
            //route: "http://localhost:3000/tasks"
        })
    }



    @Get("/:id")
    getTaskById(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
       return this.taskService.getTaskById(id, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createDTO:CreateDTO,
        @GetUser() user: User
    ): Promise<Task> {
        this.logger.verbose(`User ${user.username} creating a new Task. Data: ${JSON.stringify(createDTO)}`)
        return this.taskService.createTask(createDTO, user)
    }

    @Delete("/:id")
    deleteTask(
        @Param("id", ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<void> {
        return this.taskService.deleteTask(id, user)
    }

    @Patch("/:id/status")
    updateTaskStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body("status", TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.updateTaskStatus(id, status, user)
    }
}
