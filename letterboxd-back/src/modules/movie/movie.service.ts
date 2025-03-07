import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, UpdateResult } from 'typeorm';
import { parseOrder } from '../../common/helpers/query.helper';
import { FileService } from '../file/file.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MoviesQueryDto } from './dto/movies-query.dto';
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

  async findAll(query?: MoviesQueryDto): Promise<Movie[]> {
    if (Object.keys(query).length) {
      return this.findAllWithFilter(query);
    } else {
      return this.movieRepository.find();
    }
  }

  async findAllWithFilter(query: MoviesQueryDto) {
    const filter = {
      ...(query.title && { title: ILike(`%${query.title}%`) }),
      ...(query.synopsis && {
        synopsis: ILike(`%${query.synopsis}%`),
      }),
    };

    // Trazer dados dos filmes relacionados
    const relations: string[] = query.include ? query.include.split(',') : [];

    return await this.movieRepository.find({
      where: filter,
      order: parseOrder(query.order),
      take: query.limit || undefined,
      skip: (query.page - 1) * query.limit || 0,
      relations,
    });
  }

  async findOne(id: number, query?: MovieQueryDto): Promise<Movie> {
    const relations: string[] = query?.include ? query.include.split(',') : [];

    try {
      return await this.movieRepository.findOneOrFail({
        where: { id },
        relations: relations,
      });
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
