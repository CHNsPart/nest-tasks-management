import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMconfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "taskmanagement",
    entities: [__dirname + "/../**/*.entity.{ts,js}"],
    synchronize: true,
}