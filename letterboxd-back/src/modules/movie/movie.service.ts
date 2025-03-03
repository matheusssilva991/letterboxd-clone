import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FileService } from '../file/file.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly fileService: FileService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieRepository.save(createMovieDto);
  }

  async findAll(): Promise<Movie[]> {
    return await this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    try {
      return await this.movieRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Filme não encontrado.');
    }
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<UpdateResult> {
    const movie = await this.findOne(id);

    if (
      updateMovieDto.imagePath &&
      movie.imagePath !== updateMovieDto.imagePath
    ) {
      await this.fileService.deleteImage(movie.imagePath);
    }

    return await this.movieRepository.update(id, updateMovieDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const movie = await this.findOne(id);

    if (movie.imagePath) {
      await this.fileService.deleteImage(movie.imagePath);
    }
    return await this.movieRepository.delete(id);
  }
}
