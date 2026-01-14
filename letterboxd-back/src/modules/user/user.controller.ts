import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { DeleteResult, UpdateResult } from 'typeorm';
import { multerConfig } from '../../../config/multer.config';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { FileService } from '../file/file.service';
import { RoleGuard } from './../../common/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller({ version: '1', path: 'users' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig('users')))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<CreateUserDto, 'password'>> {
    if (image) {
      createUserDto.imagePath = image.path;
    }

    try {
      delete createUserDto.role;
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (image) {
        this.fileService.deleteImage(image.path);
      }

      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.userService.findAll();
  }

  @Get('me')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findMe(@Req() request: Request): Promise<Omit<User, 'password'>> {
    const user = request.user as User;
    return this.userService.findOne(user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.findOne(id);
  }

  @Patch(':id/role')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Pick<UpdateUserDto, 'role'>,
  ): Promise<UpdateResult> {
    return this.userService.update(id, { role: updateUserDto.role });
  }

  @Patch('me')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('users')))
  async updateMe(
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ): Promise<UpdateResult> {
    const user = request.user as User;
    const id = user.id;

    if (image) {
      updateUserDto.imagePath = image.path;
    }

    delete updateUserDto.role;

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.userService.remove(id);
  }
}
