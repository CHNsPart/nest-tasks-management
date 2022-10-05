import { IsString, Matches, MaxLength, MinLength } from "class-validator"

export class AuthCredentialsDTO {
    
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
        { message : "Password too weak! Use atleast 1 Uppercase, 1 Lowercase, 1 Special Character and the minimum length of 8 character" }
    )
    password: string
}