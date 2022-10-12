import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
/* import { UserRepository } from './user.repository'; */
import * as bcrypt from "bcrypt" 
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private logger = new Logger("AuthService")
    constructor( 
        @InjectRepository(User) private userRepository: Repository<User>,/* Repository<User> */
        private jwtService: JwtService,
     ) {}

    async signup(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        
        /* return this.userRepository.signup(authCredentialsDTO) */
        const { username, password } = authCredentialsDTO

        const user = new User()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (error) {
            if(error.code === "23505") {
                throw new ConflictException('Username already exist')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async validateUserPassword(authCredentialsDTO: AuthCredentialsDTO): Promise<string> {
        const { username, password } = authCredentialsDTO
        const user = await this.userRepository.findOneBy({ username })
        
        if (user && await user.validatePassword(password)) {
            // console.log(username)
            return user.username
            //return result
        } else {
            return null
        }       
    }

    async signin(authCredentialsDTO: AuthCredentialsDTO): Promise<{ accessToken: string }> {
        const username = await this.validateUserPassword(authCredentialsDTO)
        /* console.log(username) */
        if (!username) {
            throw new UnauthorizedException("Invalid Credentials")
        }
        
        const payload: JwtPayload = { username }
        const accessToken: string = this.jwtService.sign(payload)
        this.logger.debug(`Generated JSWT Token with payload ${JSON.stringify(payload)}`)
        return { accessToken }
    }
    

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}