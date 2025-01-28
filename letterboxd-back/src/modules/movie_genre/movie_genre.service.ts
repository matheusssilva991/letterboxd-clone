import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { GenreService } from '../genre/genre.service';
import { MovieService } from '../movie/movie.service';
import { CreateMovieGenreDto } from './dto/create-movie_genre.dto';
import { MovieGenre } from './entities/movie_genre.entity';

@Injectable()
export class MovieGenreService {
  constructor(
    @InjectRepository(MovieGenre)
    private readonly movieGenreRepository: Repository<MovieGenre>,
    private readonly movieService: MovieService,
    private readonly genreService: GenreService,
  ) {}

  async create(
    movieId: number,
    createMovieGenreDto: CreateMovieGenreDto,
  ): Promise<MovieGenre> {
    // Verifica se o filme e o gênero existem
    await this.movieService.findOne(movieId);
    await this.genreService.findOne(createMovieGenreDto.genreId);

    // Verifica se o registro já existe
    const movieGenre = await this.FindOneNoException(
      movieId,
      createMovieGenreDto.genreId,
    );

    if (movieGenre) {
      throw new BadRequestException(
        'Relação entre filme e gênero já cadastrada.',
      );
    }

    // Cria um novo registro
    return this.movieGenreRepository.save({
      ...createMovieGenreDto,
      movieId,
    });
  }

  async findAll(movieId: number): Promise<MovieGenre[]> {
    return this.movieGenreRepository.find({
      where: {
        movieId,
      },
    });
  }

  async findOne(movieId: number, genreId: number): Promise<MovieGenre> {
    try {
      return await this.movieGenreRepository.findOneOrFail({
        where: {
          movieId,
          genreId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Gênero do filme não encontrado(a).');
    }
  }

  async FindOneNoException(
    movieId: number,
    genreId: number,
  ): Promise<MovieGenre> {
    return await this.movieGenreRepository.findOne({
      where: {
        movieId,
        genreId,
      },
    });
  }

  async remove(movieId: number, genreId: number): Promise<DeleteResult> {
    const MovieGenre = await this.findOne(movieId, genreId);
    return this.movieGenreRepository.delete(MovieGenre.id);
  }
}
