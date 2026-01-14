import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Actor } from '../../actor/entities/actor.entity';
import { Director } from '../../director/entities/director.entity';
import { Genre } from '../../genre/entities/genre.entity';
import { MovieReview } from '../../movie_review/entities/movie_review.entity';

@Entity({ name: 'movie', orderBy: { id: 'ASC' } })
export class Movie {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ name: 'synopsis', type: 'text', nullable: false })
  synopsis: string;

  @Column({ name: 'duration', type: 'int', unsigned: true })
  duration: number;

  @Column({ name: 'release_date', type: 'date' })
  releaseDate: Date;

  @Column({ name: 'image_path', type: 'varchar', length: 255, nullable: true })
  imagePath: string;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable({
    name: 'movie_genre',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'genre_id', referencedColumnName: 'id' },
  })
  genres: Genre[];

  @ManyToMany(() => Director, (director) => director.movies)
  @JoinTable({
    name: 'movie_director',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'director_id', referencedColumnName: 'id' },
  })
  directors: Director[];

  @ManyToMany(() => Actor, (actor) => actor.movies)
  @JoinTable({
    name: 'movie_actor',
    joinColumn: { name: 'movie_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'actor_id', referencedColumnName: 'id' },
  })
  actors: Actor[];

  @OneToMany(() => MovieReview, (movieReview) => movieReview.movie)
  movieReviews: MovieReview[];

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
