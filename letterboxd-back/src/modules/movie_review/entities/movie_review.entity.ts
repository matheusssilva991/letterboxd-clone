import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'movie_review', orderBy: { id: 'ASC' } })
export class MovieReview {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'stars', type: 'int', unsigned: true, nullable: false })
  stars: number;

  @Column({ name: 'comment', type: 'varchar', length: 255, nullable: false })
  comment: string;

  @Column({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ManyToOne(() => Movie, (movie) => movie.movieReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => User, (user) => user.movieReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
