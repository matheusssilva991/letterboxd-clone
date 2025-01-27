import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';

@Controller({ version: '1', path: 'directors' })
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @Post()
  async create(
    @Body() createDirectorDto: CreateDirectorDto,
  ): Promise<Director> {
    return this.directorService.create(createDirectorDto);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ): Promise<UpdateResult> {
    return this.directorService.update(+id, updateDirectorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.directorService.remove(+id);
  }
}
