import { CreateTransactionDto } from './create-transction.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
