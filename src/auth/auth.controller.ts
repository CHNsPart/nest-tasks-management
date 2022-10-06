import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { GetUser } from './get-user.decorator';

@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @Post("/signup")
    signup(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        return this.authService.signup(authCredentialsDTO)
    }

    @Post("/signin")
    async signin(@Body(ValidationPipe) authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        return await this.authService.signin(authCredentialsDTO) 
    }

    @Post("/test")
    @UseGuards(AuthGuard())
    async test(@GetUser() user: User/* @Req() req:any */){
        /* const {user} = req */
        console.log(user)
    }

}
