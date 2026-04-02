import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Actor } from '../../actor/entities/actor.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'movie_actor' })
export class MovieActor {
  @PrimaryColumn({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @PrimaryColumn({ name: 'actor_id', type: 'int', unsigned: true })
  actorId: number;

  @Column({ name: 'notes', type: 'varchar', length: 255, nullable: true })
  notes: string | null;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Actor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actor_id' })
  actor: Actor;
}
