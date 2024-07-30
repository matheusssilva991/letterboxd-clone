import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
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
    await this.findOne(id);
    return await this.movieRepository.update(id, updateMovieDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return await this.movieRepository.delete(id);
  }
}
