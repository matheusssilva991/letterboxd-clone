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
import { UpdateMovieActorDto } from './dto/update-movie_actor.dto';
import { MovieActor } from './entities/movie_actor.entity';

@Injectable()
export class MovieActorService {
  constructor(
    @InjectRepository(MovieActor)
    private readonly movieActorRepository: Repository<MovieActor>,
    private readonly movieService: MovieService,
    private readonly actorService: ActorService,
  ) {}

  async create(createMovieActorDto: CreateMovieActorDto): Promise<MovieActor> {
    // Verifica se o filme e o ator/atriz existem
    await this.movieService.findOne(createMovieActorDto.movieId);
    await this.actorService.findOne(createMovieActorDto.actorId);

    // Verifica se o registro já existe
    const movieGenre = await this.findByMovieAndActorId(
      createMovieActorDto.movieId,
      createMovieActorDto.actorId,
    );

    if (movieGenre) {
      throw new BadRequestException(
        'Relação entre filme e ator/atriz já cadastrada.',
      );
    }

    // Cria um novo registro
    return this.movieActorRepository.save(createMovieActorDto);
  }

  async findAll(): Promise<MovieActor[]> {
    return this.movieActorRepository.find();
  }

  async findOne(id: number): Promise<MovieActor> {
    try {
      return await this.movieActorRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Ator/Atriz do filme não encontrado.');
    }
  }

  async update(id: number, updateMovieActorDto: UpdateMovieActorDto) {
    const movieActor = await this.findOne(id);

    // Verifica se o filme e o ator/atriz existem
    if (updateMovieActorDto.movieId)
      await this.movieService.findOne(updateMovieActorDto.movieId);
    else updateMovieActorDto.movieId = movieActor.movieId;

    if (updateMovieActorDto.actorId)
      await this.actorService.findOne(updateMovieActorDto.actorId);
    else updateMovieActorDto.actorId = movieActor.actorId;

    const movieActorExists = await this.findByMovieAndActorId(
      updateMovieActorDto.movieId,
      updateMovieActorDto.actorId,
    );

    if (movieActorExists && movieActorExists.id !== id) {
      throw new BadRequestException(
        'Relação entre filme e ator/atriz já cadastrada.',
      );
    }

    // Atualiza o registro
    return this.movieActorRepository.update(id, updateMovieActorDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.movieActorRepository.delete(id);
  }

  async findByMovieAndActorId(
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
}
