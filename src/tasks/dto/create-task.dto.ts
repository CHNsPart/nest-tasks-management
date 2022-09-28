import { IsNotEmpty } from "class-validator"

export class CreateDTO {
    @IsNotEmpty()
    title: string
    
    @IsNotEmpty()
    description: string
}
