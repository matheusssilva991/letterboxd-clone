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
import { UpdateMovieGenreDto } from './dto/update-movie_genre.dto';
import { MovieGenre } from './entities/movie_genre.entity';

@Injectable()
export class MovieGenreService {
  constructor(
    @InjectRepository(MovieGenre)
    private readonly movieGenreRepository: Repository<MovieGenre>,
    private readonly movieService: MovieService,
    private readonly genreService: GenreService,
  ) {}

  async create(createMovieGenreDto: CreateMovieGenreDto): Promise<MovieGenre> {
    // Verifica se o filme e o gênero existem
    await this.movieService.findOne(createMovieGenreDto.movieId);
    await this.genreService.findOne(createMovieGenreDto.genreId);

    // Verifica se o registro já existe
    const movieGenre = await this.findByMovieAndGenreId(
      createMovieGenreDto.movieId,
      createMovieGenreDto.genreId,
    );

    if (movieGenre) {
      throw new BadRequestException(
        'Relação entre filme e gênero já cadastrada.',
      );
    }

    // Cria um novo registro
    return this.movieGenreRepository.save(createMovieGenreDto);
  }

  async findAll(): Promise<MovieGenre[]> {
    return this.movieGenreRepository.find();
  }

  async findOne(id: number): Promise<MovieGenre> {
    try {
      return await this.movieGenreRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Gênero do filme não encontrado.');
    }
  }

  async update(id: number, updateMovieGenreDto: UpdateMovieGenreDto) {
    const movieGenre = await this.findOne(id);

    // Verifica se o filme e o gênero existem
    if (updateMovieGenreDto.movieId)
      await this.movieService.findOne(updateMovieGenreDto.movieId);
    else updateMovieGenreDto.movieId = movieGenre.movieId;

    if (updateMovieGenreDto.genreId)
      await this.genreService.findOne(updateMovieGenreDto.genreId);
    else updateMovieGenreDto.genreId = movieGenre.genreId;

    const movieGenreExists = await this.findByMovieAndGenreId(
      updateMovieGenreDto.movieId,
      updateMovieGenreDto.genreId,
    );

    if (movieGenreExists && movieGenreExists.id !== id) {
      throw new BadRequestException(
        'Relação entre filme e gênero já cadastrada.',
      );
    }

    // Atualiza o registro
    return this.movieGenreRepository.update(id, updateMovieGenreDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.movieGenreRepository.delete(id);
  }

  async findByMovieAndGenreId(
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
}
