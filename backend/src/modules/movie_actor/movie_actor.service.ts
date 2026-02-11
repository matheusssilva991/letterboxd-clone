import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActorService } from '../actor/actor.service';
import { Actor } from '../actor/entities/actor.entity';
import { Movie } from '../movie/entities/movie.entity';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class MovieActorService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly movieService: MovieService,
    private readonly actorService: ActorService,
  ) {}

  async create(movieId: number, actorId: number): Promise<Movie> {
    // Verifica se o filme e o ator/atriz existem
    const movie = await this.findMovieWithActor(movieId);
    const actor = await this.actorService.findOne(actorId);

    // Evitar duplicação
    if (await this.relationExists(movie, actorId)) {
      throw new ConflictException(
        'Relação entre filme e ator/atriz já cadastrada.',
      );
    }

    movie.actors.push(actor);
    return this.movieRepository.save(movie);
  }

  async findAll(movieId: number): Promise<Actor[]> {
    const movie = await this.findMovieWithActor(movieId);
    return movie.actors;
  }

  async findMovieWithActor(movieId: number): Promise<Movie> {
    return await this.movieService.findOne(movieId, { include: 'actors' });
  }

  async remove(movieId: number, actorId: number): Promise<Movie> {
    const movie = await this.findMovieWithActor(movieId);

    if (!(await this.relationExists(movie, actorId))) {
      throw new NotFoundException(
        'Relação entre filme e ator/atriz não encontrada.',
      );
    }

    movie.actors = movie.actors.filter((a) => a.id !== actorId);
    return await this.movieRepository.save(movie);
  }

  async relationExists(movie: Movie, actorId: number): Promise<boolean> {
    return movie.actors.some((a) => a.id === actorId);
  }
}
