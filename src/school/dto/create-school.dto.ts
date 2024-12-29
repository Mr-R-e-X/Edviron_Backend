import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateSchoolDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber(null)
  phone: string;

  @IsOptional()
  @IsMongoId({ each: true })
  students?: Types.ObjectId[];

  @IsOptional()
  @IsMongoId({ each: true })
  admins?: Types.ObjectId[];
}
