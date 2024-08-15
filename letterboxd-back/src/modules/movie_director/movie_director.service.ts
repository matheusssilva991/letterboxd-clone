import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { DirectorService } from './../director/director.service';
import { CreateMovieDirectorDto } from './dto/create-movie_director.dto';
import { UpdateMovieDirectorDto } from './dto/update-movie_director.dto';
import { MovieDirector } from './entities/movie_genre.entity';

@Injectable()
export class MovieDirectorService {
  constructor(
    @InjectRepository(MovieDirector)
    private readonly movieDirectorRepository: Repository<MovieDirector>,
    private readonly movieService: MovieService,
    private readonly directorService: DirectorService,
  ) {}

  async create(
    createMovieDirectorDto: CreateMovieDirectorDto,
  ): Promise<MovieDirector> {
    // Verifica se o filme e o diretor existem
    await this.movieService.findOne(createMovieDirectorDto.movieId);
    await this.directorService.findOne(createMovieDirectorDto.directorId);

    // Verifica se o registro já existe
    const movieDirector = await this.findByMovieAndDirectorId(
      createMovieDirectorDto.movieId,
      createMovieDirectorDto.directorId,
    );

    if (movieDirector) {
      throw new BadRequestException(
        'Relação entre filme e diretor já cadastrada.',
      );
    }

    // Cria um novo registro
    return this.movieDirectorRepository.save(createMovieDirectorDto);
  }

  async findAll(): Promise<MovieDirector[]> {
    return this.movieDirectorRepository.find();
  }

  async findOne(id: number): Promise<MovieDirector> {
    try {
      return await this.movieDirectorRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Diretor do filme não encontrado.');
    }
  }

  async update(id: number, updateMovieDirectorDto: UpdateMovieDirectorDto) {
    const movieDirector = await this.findOne(id);

    // Verifica se o filme e o director existem
    if (updateMovieDirectorDto.movieId)
      await this.movieService.findOne(updateMovieDirectorDto.movieId);
    else updateMovieDirectorDto.movieId = movieDirector.movieId;

    if (updateMovieDirectorDto.movieId)
      await this.directorService.findOne(updateMovieDirectorDto.directorId);
    else updateMovieDirectorDto.movieId = movieDirector.directorId;

    const movieDirectorExists = await this.findByMovieAndDirectorId(
      updateMovieDirectorDto.movieId,
      updateMovieDirectorDto.directorId,
    );

    if (movieDirectorExists && movieDirectorExists.id !== id) {
      throw new BadRequestException(
        'Relação entre filme e diretor já cadastrada.',
      );
    }

    // Atualiza o registro
    return this.movieDirectorRepository.update(id, updateMovieDirectorDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.movieDirectorRepository.delete(id);
  }

  async findByMovieAndDirectorId(
    movieId: number,
    directorId: number,
  ): Promise<MovieDirector> {
    return await this.movieDirectorRepository.findOne({
      where: {
        movieId,
        directorId,
      },
    });
  }
}
