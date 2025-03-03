import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult, UpdateResult } from 'typeorm';
import { multerConfig } from '../../../config/multer.config';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';
import { FileService } from '../file/file.service';

@Controller({ version: '1', path: 'directors' })
export class DirectorController {
  constructor(
    private readonly directorService: DirectorService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig('directors')))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createDirectorDto: CreateDirectorDto,
  ): Promise<Director> {
    if (image) {
      createDirectorDto.imagePath = image.path;
    }
    try {
      return await this.directorService.create(createDirectorDto);
    } catch (error) {
      this.fileService.deleteImage(image.path);

      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Director[]> {
    return this.directorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Director> {
    return this.directorService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig('directors')))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ): Promise<UpdateResult> {
    if (image) {
      updateDirectorDto.imagePath = image.path;
    }

    return this.directorService.update(+id, updateDirectorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.directorService.remove(+id);
  }
}
