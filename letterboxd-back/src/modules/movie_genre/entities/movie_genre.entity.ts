import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from '../../genre/entities/genre.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'movie_genre', orderBy: { id: 'ASC' } })
export class MovieGenre {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @Column({ name: 'genre_id', type: 'int', unsigned: true })
  genreId: number;

  @ManyToOne(() => Movie, (movie) => movie.movieGenres, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Genre, (genre) => genre.movieGenres, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;

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
