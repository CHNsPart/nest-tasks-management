import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMconfig } from './config/typeorm.config';

@Module({
  imports: [ 
    TypeOrmModule.forRoot(typeORMconfig),
    TasksModule
  ],
})
export class AppModule {}
