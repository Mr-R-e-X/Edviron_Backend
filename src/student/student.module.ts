import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/schema/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { SchoolModule } from 'src/school/school.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    SchoolModule,
  ],
  providers: [StudentService],
  controllers: [StudentController],
})
export class StudentModule {}
