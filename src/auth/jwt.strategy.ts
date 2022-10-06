import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt"
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "treatAppforADIQ",
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        //console.log("payload ",payload)
        const { username } = payload
        //console.log("username ",username)
        const user: User = await this.userRepository.findOneBy({ username })
        
        if(!user) {
            throw new UnauthorizedException()
        } else {
            //problem : consoles the User okay, but return undefined value
            //console.log("returned user console ",user)
            return user
        }
    }
}