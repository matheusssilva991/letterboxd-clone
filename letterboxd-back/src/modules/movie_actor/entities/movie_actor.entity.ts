import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Actor } from '../../actor/entities/actor.entity';
import { Movie } from '../../movie/entities/movie.entity';

@Entity({ name: 'movie_actor', orderBy: { id: 'ASC' } })
export class MovieActor {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'movie_id', type: 'int', unsigned: true })
  movieId: number;

  @Column({ name: 'actor_id', type: 'int', unsigned: true })
  actorId: number;

  @ManyToOne(() => Movie, (movie) => movie.movieActors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Movie;

  @ManyToOne(() => Actor, (actor) => actor.movieActors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'actor_id' })
  actor: Actor;

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
