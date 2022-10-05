import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
/* import { UserRepository } from './user.repository'; */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor( 
        @InjectRepository(User)
        private userRepository: Repository<User>/* Repository<User> */
     ) {}

    async signup(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        
        /* return this.userRepository.signup(authCredentialsDTO) */
        const { username, password } = authCredentialsDTO

        const user = new User()
        user.username = username
        user.password = password

        await user.save()

    }
}