import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Genre } from '../../genre/entities/genre.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'movie_genre' })
export class MovieGenre {
  @PrimaryColumn({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @PrimaryColumn({ name: 'genre_id', type: 'int', unsigned: true })
  genreId: number;

  @Column({ name: 'notes', type: 'varchar', length: 255, nullable: true })
  notes: string | null;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Genre, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'genre_id' })
  genre: Genre;
}
