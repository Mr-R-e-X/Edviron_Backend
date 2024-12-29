import { CreateSchoolAdminDto } from './createSchoolAdmin';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSchoolAdminDto extends PartialType(CreateSchoolAdminDto) {}
