import { TaskStatus } from './../task.model';

export class GetTaskFilterDTO {
    status: TaskStatus
    search: string
}