import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  middle_name?: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @IsOptional()
  @IsMongoId()
  school: Types.ObjectId;

  @IsOptional()
  @IsMongoId({ each: true })
  transactions?: Types.ObjectId[];
}
