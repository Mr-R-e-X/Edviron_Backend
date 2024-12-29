import { CreateAdminDto } from './createAdmin.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
