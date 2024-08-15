import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Director } from '../../director/entities/director.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'movie_director', orderBy: { id: 'ASC' } })
export class MovieDirector {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @Column({ name: 'director_id', type: 'int', unsigned: true })
  directorId: number;

  @ManyToOne(() => Movie, (movie) => movie.movieDirectors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Director, (director) => director.movieDirectors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'director_id' })
  director: Director;

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
