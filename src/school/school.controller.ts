import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Types } from 'mongoose';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Controller('school')
@UseGuards(AuthGuard, RolesGuard)
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    try {
      return await this.schoolService.create(createSchoolDto);
    } catch (error) {
      this.handleError(error, 'Failed to create school.');
    }
  }

  @Roles('Admin', 'School')
  @Get()
  async findAll() {
    try {
      return await this.schoolService.findAll();
    } catch (error) {
      this.handleError(error, 'Failed to retrieve schools.');
    }
  }

  @Roles('Admin', 'School')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const schoolId = new Types.ObjectId(id);
      return await this.schoolService.findOne(schoolId);
    } catch (error) {
      this.handleError(error, 'Invalid school ID.');
    }
  }

  @Roles('Admin', 'School')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    try {
      const schoolId = new Types.ObjectId(id);
      return await this.schoolService.update(schoolId, updateSchoolDto);
    } catch (error) {
      this.handleError(error, 'Failed to update school.');
    }
  }

  @Roles('Admin', 'School')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const schoolId = new Types.ObjectId(id);
      return await this.schoolService.remove(schoolId);
    } catch (error) {
      this.handleError(error, 'Failed to delete school.');
    }
  }

  private handleError(error: any, customMessage: string) {
    throw new HttpException(
      error.message || customMessage,
      error.status || HttpStatus.BAD_REQUEST,
    );
  }
}
