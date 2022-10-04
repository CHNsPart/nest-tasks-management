import { GetTaskFilterDTO } from './dto/get-task-filter.dto';
import { CreateDTO } from './dto/create-task.dto';
import { Task } from "./task.entity"
import { EntityRepository, Repository } from "typeorm";
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(filterDTO: GetTaskFilterDTO): Promise<Task[]> {
        const { status, search } = filterDTO
        const query = this.createQueryBuilder('task')

        const tasks = await query.getMany()
        return tasks
    }

    async createTask(createDTO: CreateDTO): Promise<Task> {
        const { title, description } = createDTO

        const task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        await task.save()

        return task
    }

}