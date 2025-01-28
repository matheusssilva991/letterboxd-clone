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
import { MovieDirector } from './entities/movie_director.entity';

@Injectable()
export class MovieDirectorService {
  constructor(
    @InjectRepository(MovieDirector)
    private readonly movieDirectorRepository: Repository<MovieDirector>,
    private readonly movieService: MovieService,
    private readonly directorService: DirectorService,
  ) {}

  async create(
    movieId: number,
    createMovieDirectorDto: CreateMovieDirectorDto,
  ): Promise<MovieDirector> {
    // Verifica se o filme e o diretor/diretora existem
    await this.movieService.findOne(movieId);
    await this.directorService.findOne(createMovieDirectorDto.directorId);

    // Verifica se o registro já existe
    const movieGenre = await this.FindOneNoException(
      movieId,
      createMovieDirectorDto.directorId,
    );

    if (movieGenre) {
      throw new BadRequestException(
        'Relação entre filme e diretor/diretora já cadastrada.',
      );
    }

    // Cria um novo registro
    return this.movieDirectorRepository.save({
      ...createMovieDirectorDto,
      movieId,
    });
  }

  async findAll(movieId: number): Promise<MovieDirector[]> {
    return this.movieDirectorRepository.find({
      where: {
        movieId,
      },
    });
  }

  async findOne(movieId: number, directorId: number): Promise<MovieDirector> {
    try {
      return await this.movieDirectorRepository.findOneOrFail({
        where: {
          movieId,
          directorId,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        'Diretor/Diretora do filme não encontrado(a).',
      );
    }
  }

  async FindOneNoException(
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

  async remove(movieId: number, directorId: number): Promise<DeleteResult> {
    const MovieDirector = await this.findOne(movieId, directorId);
    return this.movieDirectorRepository.delete(MovieDirector.id);
  }
}
