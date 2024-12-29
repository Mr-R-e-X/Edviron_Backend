import { AuthService } from './auth.service';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from 'src/schema/admin.schema';
import {
  School_Admin,
  School_AdminSchema,
} from 'src/schema/school-admin.schema';
import { SchoolModule } from 'src/school/school.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '24h' },
    }),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([
      { name: School_Admin.name, schema: School_AdminSchema },
    ]),
    forwardRef(() => SchoolModule),
  ],
  providers: [AuthService, AuthGuard, JwtService],
  controllers: [AuthController],
  exports: [AuthGuard, JwtService],
})
export class AuthModule {}
