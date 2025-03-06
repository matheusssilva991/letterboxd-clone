import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from '../movie/movie.module';
import { UserModule } from '../user/user.module';
import { MovieReview } from './entities/movie_actor.entity';
import { MovieReviewController } from './movie_review.controller';
import { MovieReviewService } from './movie_review.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieReview]), MovieModule, UserModule],
  controllers: [MovieReviewController],
  providers: [MovieReviewService],
  exports: [MovieReviewService],
})
export class MovieReviewModule {}
