import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SchoolService } from './school/school.service';
import { SchoolController } from './school/school.controller';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    }),
    AuthModule,
    StudentModule,
    TransactionsModule,
    SchoolModule,
  ],
  controllers: [AppController, SchoolController],
  providers: [AppService, SchoolService],
})
export class AppModule {
  constructor() {}
}
