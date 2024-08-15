import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MovieActor } from '../../movie_actor/entities/movie_actor.entity';
import { MovieDirector } from '../../movie_director/entities/movie_director.entity';
import { MovieGenre } from '../../movie_genre/entities/movie_genre.entity';

@Entity({ name: 'movie', orderBy: { id: 'ASC' } })
export class Movie {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'synopsis', type: 'text' })
  synopsis: string;

  @Column({ name: 'duration', type: 'int', unsigned: true })
  duration: number;

  @Column({ name: 'release_date', type: 'date' })
  releaseDate: Date;

  @Column({ name: 'image_path', type: 'varchar', length: 255 })
  imagePath: string;

  @OneToMany(() => MovieGenre, (movieGenre) => movieGenre.movie)
  movieGenres: MovieGenre[];

  @OneToMany(() => MovieDirector, (movieDirector) => movieDirector.movie)
  movieDirectors: MovieDirector[];

  @OneToMany(() => MovieActor, (movieActor) => movieActor.movie)
  movieActors: MovieActor[];

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
