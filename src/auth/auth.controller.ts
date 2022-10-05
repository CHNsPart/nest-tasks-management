import { AuthService } from './auth.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @Post("/signup")
    signup(@Body() authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        return this.authService.signup(authCredentialsDTO)
    }
}
