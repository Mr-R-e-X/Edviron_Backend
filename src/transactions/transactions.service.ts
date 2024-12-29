import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from 'src/schema/transaction.schema';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async findAll(page: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const resultPerPage = 20;
    const skippedMessages = (pageNumber - 1) * resultPerPage;

    const totalCount = await this.transactionModel.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student_info',
        },
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'school_id',
          foreignField: '_id',
          as: 'school_info',
        },
      },
      {
        $unwind: '$student_info',
      },
      {
        $unwind: '$school_info',
      },
      {
        $count: 'totalCount',
      },
    ]);

    const totalRecords = totalCount[0] ? totalCount[0].totalCount : 0;
    const totalPages = Math.ceil(totalRecords / resultPerPage);

    const transactions = await this.transactionModel.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student_info',
        },
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'school_id',
          foreignField: '_id',
          as: 'school_info',
        },
      },
      {
        $unwind: '$student_info',
      },
      {
        $unwind: '$school_info',
      },
      {
        $project: {
          _id: 1,
          status: 1,
          payment_method: 1,
          gateway: 1,
          transaction_amount: 1,
          bank_refrence: 1,
          'student_info.first_name': 1,
          'student_info.middle_name': 1,
          'student_info.last_name': 1,
          school_info: 1,
        },
      },
      {
        $skip: skippedMessages,
      },
      {
        $limit: resultPerPage,
      },
    ]);

    return { data: transactions, currentPage: pageNumber, totalPages };
  }

  async findBySchoolId(schoolId: string): Promise<Transaction[]> {
    if (!Types.ObjectId.isValid(schoolId)) {
      throw new NotFoundException('Invalid school ID');
    }

    console.log('School ID:', schoolId);

    const data = await this.transactionModel.aggregate([
      {
        $match: {
          school_id: new Types.ObjectId(schoolId),
        },
      },
      {
        $lookup: {
          from: 'students',
          localField: 'student_id',
          foreignField: '_id',
          as: 'student_info',
        },
      },
      {
        $lookup: {
          from: 'schools',
          localField: 'school_id',
          foreignField: '_id',
          as: 'school_info',
        },
      },
      {
        $unwind: '$student_info',
      },
      {
        $unwind: '$school_info',
      },
      {
        $project: {
          _id: 1,
          status: 1,
          payment_method: 1,
          gateway: 1,
          transaction_amount: 1,
          bank_refrence: 1,
          'student_info.first_name': 1,
          'student_info.middle_name': 1,
          'student_info.last_name': 1,
          school_info: 1,
        },
      },
    ]);

    return data;
  }

  async findByStudentId(studentId: string): Promise<Transaction[]> {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new NotFoundException('Invalid student ID');
    }
    return this.transactionModel.find({ student_id: studentId }).exec();
  }

  async checkStatus(id: string): Promise<Transaction | null> {
    return this.transactionModel.findById(id).exec();
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid transaction ID');
    }
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    if (!updatedTransaction) {
      throw new NotFoundException('Transaction not found');
    }
    return updatedTransaction;
  }
}
