import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from '../genre/genre.module';
import { Movie } from '../movie/entities/movie.entity';
import { MovieModule } from '../movie/movie.module';
import { MovieGenreController } from './movie_genre.controller';
import { MovieGenreService } from './movie_genre.service';
import { MovieGenre } from './entities/movie_genre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, MovieGenre]), MovieModule, GenreModule],
  controllers: [MovieGenreController],
  providers: [MovieGenreService],
  exports: [MovieGenreService],
})
export class MovieGenreModule {}
