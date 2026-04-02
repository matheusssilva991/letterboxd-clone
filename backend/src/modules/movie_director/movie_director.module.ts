import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorModule } from '../director/director.module';
import { Movie } from '../movie/entities/movie.entity';
import { MovieModule } from '../movie/movie.module';
import { MovieDirectorController } from './movie_director.controller';
import { MovieDirectorService } from './movie_director.service';
import { MovieDirector } from './entities/movie_director.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, MovieDirector]), MovieModule, DirectorModule],
  controllers: [MovieDirectorController],
  providers: [MovieDirectorService],
  exports: [MovieDirectorService],
})
export class MovieDirectorModule {}
