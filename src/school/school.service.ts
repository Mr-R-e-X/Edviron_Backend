import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { School } from 'src/schema/school.schema';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const newSchool = new this.schoolModel(createSchoolDto);
    return await newSchool.save();
  }
  async findAll(): Promise<School[]> {
    return await this.schoolModel.find().populate('students').exec();
  }

  async findOne(id: Types.ObjectId): Promise<School> {
    const school = await this.schoolModel
      .findById(id)
      .populate('students')
      .exec();
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(
    id: Types.ObjectId,
    updateSchoolDto: UpdateSchoolDto,
  ): Promise<School> {
    const updatedSchool = await this.schoolModel
      .findByIdAndUpdate(id, updateSchoolDto, { new: true })
      .exec();
    if (!updatedSchool) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return updatedSchool;
  }

  async remove(id: Types.ObjectId): Promise<School> {
    const deletedSchool = await this.schoolModel.findByIdAndDelete(id).exec();
    if (!deletedSchool) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return deletedSchool;
  }
}
