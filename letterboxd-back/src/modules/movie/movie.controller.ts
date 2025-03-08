import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult, UpdateResult } from 'typeorm';
import { multerConfig } from '../../../config/multer.config';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { FileService } from '../file/file.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';

@Controller({ version: '1', path: 'movies' })
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('movies')))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createMovieDto: CreateMovieDto,
  ): Promise<Movie> {
    if (image) {
      createMovieDto.imagePath = image.path;
    }

    try {
      return await this.movieService.create(createMovieDto);
    } catch (error) {
      this.fileService.deleteImage(image.path);

      throw error;
    }
  }

  @Get()
  async findAll(@Query() query: MoviesQueryDto): Promise<Movie[]> {
    return this.movieService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: MovieQueryDto,
  ): Promise<Movie> {
    return this.movieService.findOne(+id, query);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('movies')))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<UpdateResult> {
    if (image) {
      updateMovieDto.imagePath = image.path;
    }
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.movieService.remove(+id);
  }
}
