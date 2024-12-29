import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Roles('Admin', 'School')
  @Get()
  async getAllTransactions(@Query('page') page: string = '1') {
    try {
      return await this.transactionsService.findAll(page);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Roles('Admin', 'School')
  @Get('/school/:schoolId')
  async getTransactionsBySchool(@Param('schoolId') schoolId: string) {
    try {
      console.log('request comun.......');
      return await this.transactionsService.findBySchoolId(schoolId);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Roles('Admin', 'School')
  @Get('/student/:studentId')
  async getTransactionsByStudent(@Param('studentId') studentId: string) {
    try {
      return await this.transactionsService.findByStudentId(studentId);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Roles('Admin', 'School')
  @Get('/status')
  async checkTransactionStatus(@Query('transactionId') transactionId: string) {
    try {
      if (!transactionId) {
        throw new HttpException(
          'Transaction ID is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.transactionsService.checkStatus(transactionId);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Roles('Admin', 'School')
  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    try {
      return await this.transactionsService.update(id, updateTransactionDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.response) {
      throw new HttpException(
        error.response,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException(
      'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
