import { TaskStatus } from './../task.model';
import { BadRequestException, PipeTransform } from "@nestjs/common";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ]

    transform(value: any) {
        //console.log("value", value)
        value = value.toUpperCase()
        if(!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status`)
        }
        return value
    }

    private isStatusValid(status:any){
        const idx = this.allowedStatuses.indexOf(status)
        return idx !== -1
    }
}