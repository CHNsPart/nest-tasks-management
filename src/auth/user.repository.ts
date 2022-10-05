import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { EntityRepository, Repository,  } from 'typeorm';
import { User } from './user.entity';


@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signup(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentialsDTO

        const user = new User()
        user.username = username
        user.password = password

        await user.save()

    }
}