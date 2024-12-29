import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { School } from 'src/schema/school.schema';
import { Student } from 'src/schema/student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async create(
    createStudentDto: CreateStudentDto,
    schoolId: string,
  ): Promise<Student> {
    const school = await this.schoolModel.findById(schoolId).exec();
    if (!school) {
      throw new NotFoundException('School not found');
    }

    const createdStudent = new this.studentModel({
      ...createStudentDto,
      school: schoolId,
    });
    const student = await createdStudent.save();

    await this.schoolModel.updateOne(
      { _id: schoolId },
      { $push: { students: student._id } },
    );
    return student;
  }

  async findAll(schoolId: string) {
    return this.studentModel.find({ school: schoolId }).exec();
  }

  async findOne(id: string, schoolId: string) {
    const student = await this.studentModel
      .findOne({ _id: id, school: schoolId })
      .exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
    schoolId: string,
  ) {
    const student = await this.studentModel
      .findOneAndUpdate(
        { _id: id, school: schoolId },
        { $set: updateStudentDto },
        { new: true, runValidators: true },
      )
      .exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async remove(id: string, schoolId: string) {
    const student = await this.studentModel
      .findOneAndDelete({ _id: id, school: schoolId })
      .exec();
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.schoolModel.updateOne(
      { _id: schoolId },
      { $pull: { students: id } },
    );
    return { message: 'Student deleted successfully', student };
  }
}
