import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GenreModule } from '../genre/genre.module';
import { MovieModule } from '../movie/movie.module';
import { MovieGenre } from './entities/movie_genre.entity';
import { MovieGenreController } from './movie_genre.controller';
import { MovieGenreService } from './movie_genre.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieGenre]), MovieModule, GenreModule],
  controllers: [MovieGenreController],
  providers: [MovieGenreService],
  exports: [MovieGenreService],
})
export class MovieGenreModule {}
