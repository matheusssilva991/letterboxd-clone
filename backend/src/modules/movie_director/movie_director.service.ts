import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Director } from '../director/entities/director.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieService } from '../movie/movie.service';
import { DirectorService } from './../director/director.service';
import { UpdateMovieDirectorDto } from './dto/update-movie_director.dto';
import { MovieDirector } from './entities/movie_director.entity';

@Injectable()
export class MovieDirectorService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDirector)
    private readonly movieDirectorRepository: Repository<MovieDirector>,
    private readonly movieService: MovieService,
    private readonly directorService: DirectorService,
  ) {}

  async create(movieId: number, directorId: number): Promise<Movie> {
    // Verifica se o filme e diretor(a) existem
    const movie = await this.findMovieWithDirector(movieId);
    const director = await this.directorService.findOne(directorId);

    // Evitar duplicação
    if (await this.relationExists(movie, directorId)) {
      throw new ConflictException(
        'Relação entre filme e diretor(a) já cadastrada.',
      );
    }

    movie.directors.push(director);
    return this.movieRepository.save(movie);
  }

  async findAll(movieId: number): Promise<Director[]> {
    const movie = await this.findMovieWithDirector(movieId);
    return movie.directors;
  }

  async findMovieWithDirector(movieId: number): Promise<Movie> {
    return await this.movieService.findOne(movieId, { include: 'directors' });
  }

  async remove(movieId: number, directorId: number): Promise<Movie> {
    const movie = await this.findMovieWithDirector(movieId);

    if (!(await this.relationExists(movie, directorId))) {
      throw new NotFoundException(
        'Relação entre filme e diretor(a) não encontrada.',
      );
    }

    movie.directors = movie.directors.filter((a) => a.id !== directorId);
    return await this.movieRepository.save(movie);
  }

  async update(
    movieId: number,
    directorId: number,
    updateMovieDirectorDto: UpdateMovieDirectorDto,
  ): Promise<number> {
    const result = await this.movieDirectorRepository.update(
      { movieId, directorId },
      { notes: updateMovieDirectorDto.notes ?? null },
    );

    if (!result.affected) {
      throw new NotFoundException(
        'Relação entre filme e diretor(a) não encontrada.',
      );
    }

    return result.affected;
  }

  async relationExists(movie: Movie, directorId: number): Promise<boolean> {
    return movie.directors.some((a) => a.id === directorId);
  }
}
