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
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { GenreService } from './genre.service';

@Controller()
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('genre')
  async create(@Body() createGenreDto: CreateGenreDto): Promise<Genre> {
    return this.genreService.create(createGenreDto);
  }

  @Get('genres')
  async findAll(): Promise<Genre[]> {
    return this.genreService.findAll();
  }

  @Get('genre/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Genre> {
    return this.genreService.findOne(+id);
  }

  @Patch('genre/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<UpdateResult> {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete('genre/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.genreService.remove(+id);
  }
}
