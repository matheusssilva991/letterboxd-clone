import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ActorService } from '../actor/actor.service';
import { MovieService } from '../movie/movie.service';
import { CreateMovieActorDto } from './dto/create-movie_actor.dto';
import { MovieActor } from './entities/movie_actor.entity';

@Injectable()
export class MovieActorService {
  constructor(
    @InjectRepository(MovieActor)
    private readonly movieActorRepository: Repository<MovieActor>,
    private readonly movieService: MovieService,
    private readonly actorService: ActorService,
  ) {}

  async create(
    movieId: number,
    createMovieActorDto: CreateMovieActorDto,
  ): Promise<MovieActor> {
    // Verifica se o filme e o ator/atriz existem
    await this.movieService.findOne(movieId);
    await this.actorService.findOne(createMovieActorDto.actorId);

    // Verifica se o registro já existe
    const movieGenre = await this.FindOneNoException(
      movieId,
      createMovieActorDto.actorId,
    );

    if (movieGenre) {
      throw new BadRequestException(
        'Relação entre filme e ator/atriz já cadastrada.',
      );
    }

    // Cria um novo registro
    return this.movieActorRepository.save({ ...createMovieActorDto, movieId });
  }

  async findAll(movieId: number): Promise<MovieActor[]> {
    return this.movieActorRepository.find({
      where: {
        movieId,
      },
    });
  }

  async findOne(movieId: number, actorId: number): Promise<MovieActor> {
    try {
      return await this.movieActorRepository.findOneOrFail({
        where: {
          movieId,
          actorId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Ator/Atriz do filme não encontrado.');
    }
  }

  async FindOneNoException(
    movieId: number,
    actorId: number,
  ): Promise<MovieActor> {
    return await this.movieActorRepository.findOne({
      where: {
        movieId,
        actorId,
      },
    });
  }

  async remove(movieId: number, actorId: number): Promise<DeleteResult> {
    const movieActor = await this.findOne(movieId, actorId);
    return this.movieActorRepository.delete(movieActor.id);
  }
}
