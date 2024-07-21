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
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { GenreService } from './genre.service';

@Controller()
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post('genre')
  async create(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get('genres')
  async findAll() {
    return this.genreService.findAll();
  }

  @Get('genre/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.findOne(+id);
  }

  @Patch('genre/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(+id, updateGenreDto);
  }

  @Delete('genre/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.genreService.remove(+id);
  }
}
