import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/loginAdmin';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { CreateSchoolAdminDto } from './dto/createSchoolAdmin';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/admin/login')
  async loginAdmin(@Body() loginAdminDto: LoginAdminDto, @Res() res: Response) {
    return await this.authService.loginAdmin(loginAdminDto, res);
  }

  @Post('/school-admin/login')
  async loginSchoolAdmin(
    @Body() loginAdminDto: LoginAdminDto,
    @Res() res: Response,
  ) {
    return await this.authService.loginSchool(loginAdminDto, res);
  }

  @Post('/admin/create')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.authService.createAdmin(createAdminDto);
  }

  @Post('/school-admin/create')
  async createSchoolAdmin(@Body() createSchoolAdminDto: CreateSchoolAdminDto) {
    console.log('request Coming');
    return await this.authService.createSchoolAdmin(createSchoolAdminDto);
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }
}
