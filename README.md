<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://user-images.githubusercontent.com/58574102/194750412-e38fc8b8-d2a1-48f3-ac58-c306bf6806c8.png" width="200" alt="Nest Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A Simlpe [Nest](https://github.com/nestjs/nest) framework TypeScript repository. A task management project with NEST.JS with PostgreSQL.

## Installation for the Existing Project

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Explanation Step-by-Step
Start the project by generating a nest starter boiler plate. My inital repo name will be taskmanagement

```bash
nest new taskmanagement
```
Setup TypeORM for the database connection. I will use PostgreSQL. Here pg means postgres.

```bash
npm install --save @nestjs/typeorm typeorm pg
```
Now I will create ```typeorm.config.ts``` file under the **config** folder to create the configuation class for TypeORM purpose.

```bash
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
```
Import the ```typeorm.config.ts``` file into the ```app.module.ts``` file for the connection.

```bash
import { Module } from '@nestjs/common';
import { typeORMconfig } from './config/typeorm.config';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(typeORMconfig),
  ],
})
export class AppModule {}
```
Now I will generate a **tasks** directory to generate a ```tasks.module.ts``` ```tasks.service.ts``` and ```tasks.controller.ts``` files from the nest cli.
*--no-specs* flag will help you to not to generate any extra testing files.

```bash
nest gen module tasks --no-specs
nest gen controller tasks --no-specs
nest gen service tasks --no-specs
```
Now the **App module** will automatically import the **Task Module** to its **imports** arraylist to work with it. We now have to create a ```task.entity.ts``` as a database entity and will pass it to the ```tasks.module.ts``` files import arraylist as a feature for the **TypeORM** so we can connect to the database and save out tasks innit. And ```task-status.enum.ts``` for the types of our Task Status

```bash
//enum types for the task.status
export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}
```

```bash
//Entity File

import { TaskStatus } from './task-status.enum';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';


@Entity()
export class Task extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    description: string;
    
    @Column()
    status: TaskStatus;

}
```
Lets configuare the ```app.module.ts``` for now.

```bash
import { Task } from './task.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
  providers: [TasksService],
})

export class TasksModule {}
```
Now, just for fun! If you want to play with custom repositories, (which normally gets handeled by the nest it self) your ```app.module.ts``` will look something like.

```bash
//instead of the Task entity file, you have to provide the **TaskRepository** file as the TypeORM feature.
//import { Task } from './task.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TaskRepository } from './task.repository';

@Module({
  imports: [ TypeOrmModule.forFeature([TaskRepository])],
  controllers: [TasksController],
  providers: [TasksService],
})

export class TasksModule {}
```
And the Repository file will look like - 

```bash
import { Task } from "./task.entity"
import { EntityRepository, Repository } from "typeorm";
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {}
```

## Stay in touch

- Author - [Touhidul Islam Chayan](https://chnspart.com)

## License

Nest is [MIT licensed](LICENSE).
