import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { MovieService } from '../movie/movie.service';
import { UserService } from '../user/user.service';
import { CreateMovieReviewDto } from './dto/create-movie_review.dto';
import { MovieReview } from './entities/movie_actor.entity';

@Injectable()
export class MovieReviewService {
  constructor(
    @InjectRepository(MovieReview)
    private readonly movieReviewRepository: Repository<MovieReview>,
    private readonly movieService: MovieService,
    private readonly userService: UserService,
  ) {}

  async create(
    movieId: number,
    createMovieReviewDto: CreateMovieReviewDto,
  ): Promise<MovieReview> {
    // Verifica se o filme e o usuário existem
    await this.movieService.findOne(movieId);
    await this.userService.findOne(createMovieReviewDto.userId);

    // Cria um novo registro
    return this.movieReviewRepository.save({
      ...createMovieReviewDto,
      movieId,
    });
  }

  async findAll(movieId: number): Promise<MovieReview[]> {
    return this.movieReviewRepository.find({
      where: {
        movieId,
      },
    });
  }

  async findAllByUser(movieId: number, userId: number): Promise<MovieReview[]> {
    return await this.movieReviewRepository.find({
      where: {
        movieId,
        userId,
      },
    });
  }

  async findOne(id: number): Promise<MovieReview> {
    try {
      return await this.movieReviewRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Critica não encontrada.');
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);
    return this.movieReviewRepository.delete(id);
  }
}
