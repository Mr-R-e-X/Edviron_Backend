import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AuthenticatedRequest } from 'src/types/express-request.interface';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentService } from './student.service';

@Controller('student')
@UseGuards(AuthGuard, RolesGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Roles('School')
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const schoolId = req.user.id;
      return await this.studentService.create(createStudentDto, schoolId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error creating student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('School')
  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    try {
      const schoolId = req.user.id;
      return await this.studentService.findAll(schoolId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error fetching students',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles('School')
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    try {
      const schoolId = req.user.id;
      return await this.studentService.findOne(id, schoolId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Student not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Roles('School')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const schoolId = req.user.id;
      return await this.studentService.update(id, updateStudentDto, schoolId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Roles('School')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    try {
      const schoolId = req.user.id;
      return await this.studentService.remove(id, schoolId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error deleting student',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
