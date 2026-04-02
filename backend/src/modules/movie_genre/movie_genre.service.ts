import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../genre/entities/genre.entity';
import { GenreService } from '../genre/genre.service';
import { Movie } from '../movie/entities/movie.entity';
import { MovieService } from '../movie/movie.service';
import { UpdateMovieGenreDto } from './dto/update-movie_genre.dto';
import { MovieGenre } from './entities/movie_genre.entity';

@Injectable()
export class MovieGenreService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieGenre)
    private readonly movieGenreRepository: Repository<MovieGenre>,
    private readonly movieService: MovieService,
    private readonly genreService: GenreService,
  ) {}

  async create(movieId: number, genreId: number): Promise<Movie> {
    // Verifica se o filme e gênero existem
    const movie = await this.findMovieWithGenre(movieId);
    const genre = await this.genreService.findOne(genreId);

    // Evitar duplicação
    if (await this.relationExists(movie, genreId)) {
      throw new ConflictException(
        'Relação entre filme e gênero já cadastrada.',
      );
    }

    movie.genres.push(genre);
    return this.movieRepository.save(movie);
  }

  async findAll(movieId: number): Promise<Genre[]> {
    const movie = await this.findMovieWithGenre(movieId);
    return movie.genres;
  }

  async findMovieWithGenre(movieId: number): Promise<Movie> {
    return await this.movieService.findOne(movieId, { include: 'genres' });
  }

  async remove(movieId: number, genreId: number): Promise<Movie> {
    const movie = await this.findMovieWithGenre(movieId);

    if (!(await this.relationExists(movie, genreId))) {
      throw new NotFoundException(
        'Relação entre filme e gênero não encontrada.',
      );
    }

    movie.genres = movie.genres.filter((a) => a.id !== genreId);
    return await this.movieRepository.save(movie);
  }

  async update(
    movieId: number,
    genreId: number,
    updateMovieGenreDto: UpdateMovieGenreDto,
  ): Promise<number> {
    const result = await this.movieGenreRepository.update(
      { movieId, genreId },
      { notes: updateMovieGenreDto.notes ?? null },
    );

    if (!result.affected) {
      throw new NotFoundException(
        'Relação entre filme e gênero não encontrada.',
      );
    }

    return result.affected;
  }

  async relationExists(movie: Movie, genreId: number): Promise<boolean> {
    return movie.genres.some((a) => a.id === genreId);
  }
}
