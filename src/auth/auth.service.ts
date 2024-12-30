import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin } from 'src/schema/admin.schema';
import { School_Admin } from 'src/schema/school-admin.schema';
import { School } from 'src/schema/school.schema';
import { LoginAdminDto } from './dto/loginAdmin';
import { CreateAdminDto } from './dto/createAdmin.dto';
import { CreateSchoolAdminDto } from './dto/createSchoolAdmin';
import { comparePassword, hashPassword } from 'src/helpers/hashPassword.helper';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(School_Admin.name)
    private schoolAdminModel: Model<School_Admin>,
    @InjectModel(School.name) private schoolModel: Model<School>,
  ) {}

  async loginAdmin(loginAdminDto: LoginAdminDto, res: Response) {
    try {
      console.log('Login request received for admin');

      const admin = await this.adminModel.findOne({
        email: loginAdminDto.email,
      });
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      console.log(admin.password);
      console.log(loginAdminDto.password);
      const isValidPassword = await comparePassword(
        loginAdminDto.password,
        admin.password,
      );
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = { id: admin._id, email: admin.email, role: 'Admin' };
      const token = this.jwtService.sign(payload, { secret });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none',
      });

      return res.status(200).json({
        message: 'Login successful',
        token,
        id: admin._id,
        email: admin.email,
        role: 'Admin',
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async loginSchool(loginAdminDto: LoginAdminDto, res: Response) {
    try {
      const schoolAdmin = await this.schoolAdminModel.findOne({
        email: loginAdminDto.email,
      });
      if (!schoolAdmin) {
        return res.status(404).json({ message: 'School admin not found' });
      }

      if (!comparePassword(loginAdminDto.password, schoolAdmin.password)) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      const payload = {
        id: schoolAdmin._id,
        email: schoolAdmin.email,
        role: 'School',
      };
      const secret = this.configService.get<string>('JWT_SECRET');
      const token = this.jwtService.sign(payload, { secret });

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'none',
      });

      return res.status(200).json({
        message: 'Login successful',
        token,
        id: schoolAdmin._id,
        email: schoolAdmin.email,
        role: 'School',
        school_id: schoolAdmin.school_id,
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    try {
      const hashedPassword = await hashPassword(createAdminDto.password);

      const admin = await this.adminModel.create({
        ...createAdminDto,
        password: hashedPassword,
      });

      return admin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw new Error('Error creating admin');
    }
  }

  async createSchoolAdmin(createSchoolAdminDto: CreateSchoolAdminDto) {
    try {
      const school = await this.schoolModel.findOne({
        _id: new Types.ObjectId(createSchoolAdminDto.school_id),
      });
      if (!school) {
        return null;
      }
      const existsAdmin = await this.schoolAdminModel.findOne({
        email: createSchoolAdminDto.email,
      });
      if (existsAdmin) {
        return null;
      }

      const hashedPassword = await hashPassword(createSchoolAdminDto.password);

      const schoolAdmin = await this.schoolAdminModel.create({
        ...createSchoolAdminDto,
        password: hashedPassword,
      });

      return schoolAdmin;
    } catch (error) {
      console.error('Error creating school admin:', error);
      throw new Error('Error creating school admin');
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return res.status(500).json({
        message: 'Error during logout',
        error: error.message,
      });
    }
  }
}
