import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(['Success', 'Pending', 'Failed'])
  status: string;

  @IsNotEmpty()
  @IsString()
  payment_method: string;

  @IsNotEmpty()
  @IsString()
  gateway: string;

  @IsNotEmpty()
  @IsNumber()
  transaction_amount: number;

  @IsOptional()
  @IsString()
  bank_refrence?: string;

  @IsNotEmpty()
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  studentId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  schoolId: Types.ObjectId;
}
