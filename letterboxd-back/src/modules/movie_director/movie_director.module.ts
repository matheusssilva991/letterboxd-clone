import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectorModule } from '../director/director.module';
import { MovieModule } from '../movie/movie.module';
import { MovieDirector } from './entities/movie_genre.entity';
import { MovieDirectorController } from './movie_director.controller';
import { MovieDirectorService } from './movie_director.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDirector]),
    MovieModule,
    DirectorModule,
  ],
  controllers: [MovieDirectorController],
  providers: [MovieDirectorService],
  exports: [MovieDirectorService],
})
export class MovieDirectorModule {}
