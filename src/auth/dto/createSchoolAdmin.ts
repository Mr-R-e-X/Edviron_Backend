import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateSchoolAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsMongoId()
  @IsNotEmpty()
  school_id: Types.ObjectId;

  is_verified_by_school?: boolean;
}
