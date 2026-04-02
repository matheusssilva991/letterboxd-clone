import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Director } from '../../director/entities/director.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'movie_director' })
export class MovieDirector {
  @PrimaryColumn({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @PrimaryColumn({ name: 'director_id', type: 'int', unsigned: true })
  directorId: number;

  @Column({ name: 'notes', type: 'varchar', length: 255, nullable: true })
  notes: string | null;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Director, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'director_id' })
  director: Director;
}
