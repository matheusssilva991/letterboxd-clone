import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import axios, { AxiosInstance } from 'axios';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../../app.module';
import { RoleEnum } from '../../common/enums/role.enum';
import { Actor } from '../../modules/actor/entities/actor.entity';
import { Director } from '../../modules/director/entities/director.entity';
import { Genre } from '../../modules/genre/entities/genre.entity';
import { MovieReview } from '../../modules/movie_review/entities/movie_review.entity';
import { Movie } from '../../modules/movie/entities/movie.entity';
import { User } from '../../modules/user/entities/user.entity';

interface TmdbListMovie {
  id: number;
}

interface TmdbListResponse {
  results: TmdbListMovie[];
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbPerson {
  id: number;
  name: string;
  profile_path: string | null;
}

interface TmdbCrewMember extends TmdbPerson {
  job: string;
}

interface TmdbMovieDetails {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  runtime: number | null;
  release_date: string;
  poster_path: string | null;
  genres: TmdbGenre[];
  credits: {
    cast: TmdbPerson[];
    crew: TmdbCrewMember[];
  };
}

interface SeedCounters {
  movies: number;
  genres: number;
  actors: number;
  directors: number;
  users: number;
  reviews: number;
}

const logger = new Logger('DemoSeed');
const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p/w500';

const fictitiousNames = [
  ['Ana Clara', 'anaclara'],
  ['Bruno Tavares', 'brunotavares'],
  ['Camila Nunes', 'camilanunes'],
  ['Daniel Rocha', 'danielrocha'],
  ['Elisa Martins', 'elisamartins'],
  ['Felipe Costa', 'felipecosta'],
  ['Gabriela Luz', 'gabrielaluz'],
  ['Henrique Melo', 'henriquemelo'],
  ['Isabela Freitas', 'isabelafreitas'],
  ['João Vitor', 'joaovitor'],
  ['Larissa Andrade', 'larissaandrade'],
  ['Marcos Vinícius', 'marcosvinicius'],
  ['Natália Ribeiro', 'nataliaribeiro'],
  ['Pedro Henrique', 'pedrohenrique'],
  ['Rafaela Moura', 'rafaelamoura'],
] as const;

const reviewComments = [
  'Uma experiência envolvente, com atuações que permanecem na memória.',
  'A fotografia é belíssima e ajuda a contar a história em cada cena.',
  'Gostei muito do ritmo e da forma como os personagens foram construídos.',
  'Um filme competente, embora o terceiro ato pudesse ser mais enxuto.',
  'Daqueles filmes que continuam rendendo conversa depois dos créditos.',
  'A trilha sonora e a direção criam uma atmosfera muito marcante.',
  'Não me conquistou por completo, mas tem ideias realmente interessantes.',
  'Uma ótima surpresa. Simples, bem executado e cheio de personalidade.',
  'O elenco está excelente e dá força até aos momentos mais previsíveis.',
  'Visualmente impressionante, mas senti falta de mais profundidade no roteiro.',
  'Uma história emocionante sem exagerar no sentimentalismo.',
  'Reassistiria com facilidade; há muitos detalhes para descobrir.',
  'Divertido do começo ao fim e com um ótimo senso de ritmo.',
  'A proposta é boa, mas o resultado ficou um pouco irregular.',
  'Cinema feito com cuidado, identidade e amor pelos personagens.',
] as const;

function readPositiveInteger(name: string, fallback: number, maximum: number) {
  const parsed = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, maximum)
    : fallback;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('pt-BR');
}

function movieKey(title: string, releaseDate: string | Date) {
  const date =
    releaseDate instanceof Date
      ? releaseDate.toISOString().slice(0, 10)
      : releaseDate.slice(0, 10);
  return `${normalize(title)}|${date}`;
}

function imageUrl(path: string | null) {
  return path ? `${tmdbImageBaseUrl}${path}` : null;
}

function createTmdbClient(accessToken?: string, apiKey?: string): AxiosInstance {
  return axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
          accept: 'application/json',
        }
      : { accept: 'application/json' },
    params: apiKey && !accessToken ? { api_key: apiKey } : undefined,
    timeout: 15_000,
  });
}

function readTmdbCredentials() {
  const configuredAccessToken = process.env.TMDB_ACCESS_TOKEN?.trim();
  const configuredApiKey = process.env.TMDB_API_KEY?.trim();
  const accessTokenContainsApiKey =
    configuredAccessToken &&
    /^[a-f0-9]{32}$/i.test(configuredAccessToken);

  return {
    accessToken: accessTokenContainsApiKey
      ? undefined
      : configuredAccessToken,
    apiKey: configuredApiKey || (accessTokenContainsApiKey
      ? configuredAccessToken
      : undefined),
  };
}

async function fetchMovies(
  client: AxiosInstance,
  language: string,
  pages: number,
  limit: number,
) {
  const ids: number[] = [];

  for (let page = 1; page <= pages && ids.length < limit; page += 1) {
    const { data } = await client.get<TmdbListResponse>('/movie/popular', {
      params: { language, page },
    });
    ids.push(...data.results.map((movie) => movie.id));
  }

  const details: TmdbMovieDetails[] = [];
  const selectedIds = [...new Set(ids)].slice(0, limit);

  for (let index = 0; index < selectedIds.length; index += 5) {
    const batch = selectedIds.slice(index, index + 5);
    const responses = await Promise.all(
      batch.map((id) =>
        client.get<TmdbMovieDetails>(`/movie/${id}`, {
          params: { append_to_response: 'credits', language },
        }),
      ),
    );
    details.push(...responses.map((response) => response.data));
  }

  return details.filter(
    (movie) =>
      movie.title.trim() &&
      /^\d{4}-\d{2}-\d{2}$/.test(movie.release_date) &&
      movie.runtime &&
      movie.runtime > 0,
  );
}

async function findOrCreateNamedEntity<T extends Genre | Actor | Director>(
  repository: Repository<T>,
  cache: Map<string, T>,
  values: Partial<T>,
  counters: SeedCounters,
  counter: 'genres' | 'actors' | 'directors',
) {
  const key = normalize(values.name);
  const existing = cache.get(key);
  if (existing) {
    return existing;
  }

  const draft = repository.create();
  Object.assign(draft, values);
  const entity = await repository.save(draft);
  cache.set(key, entity);
  counters[counter] += 1;
  return entity;
}

async function importMovies(
  dataSource: DataSource,
  tmdbMovies: TmdbMovieDetails[],
  counters: SeedCounters,
) {
  const movieRepository = dataSource.getRepository(Movie);
  const genreRepository = dataSource.getRepository(Genre);
  const actorRepository = dataSource.getRepository(Actor);
  const directorRepository = dataSource.getRepository(Director);

  const [storedMovies, storedGenres, storedActors, storedDirectors] =
    await Promise.all([
      movieRepository.find({
        relations: { genres: true, actors: true, directors: true },
      }),
      genreRepository.find(),
      actorRepository.find(),
      directorRepository.find(),
    ]);

  const moviesByKey = new Map(
    storedMovies.map((movie) => [
      movieKey(movie.title, movie.releaseDate),
      movie,
    ]),
  );
  const genresByName = new Map(
    storedGenres.map((genre) => [normalize(genre.name), genre]),
  );
  const actorsByName = new Map(
    storedActors.map((actor) => [normalize(actor.name), actor]),
  );
  const directorsByName = new Map(
    storedDirectors.map((director) => [normalize(director.name), director]),
  );
  const importedMovies: Movie[] = [];

  for (const source of tmdbMovies) {
    const key = movieKey(source.title, source.release_date);
    const existing = moviesByKey.get(key);
    if (existing) {
      importedMovies.push(existing);
      continue;
    }

    const genres = await Promise.all(
      source.genres.map((genre) =>
        findOrCreateNamedEntity(
          genreRepository,
          genresByName,
          { name: genre.name },
          counters,
          'genres',
        ),
      ),
    );
    const actors = await Promise.all(
      source.credits.cast.slice(0, 8).map((actor) =>
        findOrCreateNamedEntity(
          actorRepository,
          actorsByName,
          {
            name: actor.name,
            description: `Integra o elenco de ${source.title}.`,
            imagePath: imageUrl(actor.profile_path),
          },
          counters,
          'actors',
        ),
      ),
    );
    const directors = await Promise.all(
      source.credits.crew
        .filter((person) => person.job === 'Director')
        .map((director) =>
          findOrCreateNamedEntity(
            directorRepository,
            directorsByName,
            {
              name: director.name,
              description: `Responsável pela direção de ${source.title}.`,
              imagePath: imageUrl(director.profile_path),
            },
            counters,
            'directors',
          ),
        ),
    );

    const draft = movieRepository.create();
    Object.assign(draft, {
      title: source.title || source.original_title,
      synopsis:
        source.overview.trim() ||
        `Sinopse de ${source.title} ainda não disponível em português.`,
      duration: source.runtime,
      releaseDate: new Date(`${source.release_date}T00:00:00.000Z`),
      imagePath: imageUrl(source.poster_path),
      genres,
      actors,
      directors,
    });
    const movie = await movieRepository.save(draft);
    moviesByKey.set(key, movie);
    importedMovies.push(movie);
    counters.movies += 1;
  }

  return importedMovies;
}

async function createFictitiousUsers(
  dataSource: DataSource,
  count: number,
  password: string,
  counters: SeedCounters,
) {
  const repository = dataSource.getRepository(User);
  const storedUsers = await repository.find();
  const usersByEmail = new Map(
    storedUsers.map((user) => [normalize(user.email), user]),
  );
  const passwordHash = await bcrypt.hash(password, 10);
  const users: User[] = [];

  for (let index = 0; index < count; index += 1) {
    const [baseName, baseUsername] =
      fictitiousNames[index % fictitiousNames.length];
    const suffix =
      index < fictitiousNames.length
        ? ''
        : String(Math.floor(index / fictitiousNames.length) + 1);
    const username = `${baseUsername}${suffix}`;
    const email = `${username}@cinefilos.example`;
    const existing = usersByEmail.get(normalize(email));

    if (existing) {
      users.push(existing);
      continue;
    }

    const user = await repository.save(
      repository.create({
        name: suffix ? `${baseName} ${suffix}` : baseName,
        username,
        email,
        password: passwordHash,
        role: RoleEnum.USER,
        imagePath: null,
      }),
    );
    usersByEmail.set(normalize(email), user);
    users.push(user);
    counters.users += 1;
  }

  return users;
}

async function createFictitiousReviews(
  dataSource: DataSource,
  users: User[],
  movies: Movie[],
  count: number,
  counters: SeedCounters,
) {
  if (!users.length || !movies.length) {
    return;
  }

  const repository = dataSource.getRepository(MovieReview);
  const storedReviews = await repository.find({
    select: { userId: true, movieId: true },
  });
  const existingPairs = new Set(
    storedReviews.map((review) => `${review.userId}:${review.movieId}`),
  );
  const maximum = Math.min(count, users.length * movies.length);
  const candidates: Array<{
    user: User;
    movie: Movie;
    userIndex: number;
    offset: number;
  }> = [];

  for (let offset = 0; offset < movies.length; offset += 1) {
    for (let userIndex = 0; userIndex < users.length; userIndex += 1) {
      const user = users[userIndex];
      const movie = movies[(userIndex * 7 + offset) % movies.length];
      candidates.push({ user, movie, userIndex, offset });
      if (candidates.length === maximum) {
        break;
      }
    }
    if (candidates.length === maximum) {
      break;
    }
  }

  for (const { user, movie, userIndex, offset } of candidates) {
    const pair = `${user.id}:${movie.id}`;
    if (existingPairs.has(pair)) {
      continue;
    }

    const commentIndex =
      (userIndex * 3 + offset + movie.id) % reviewComments.length;
    await repository.save(
      repository.create({
        userId: user.id,
        movieId: movie.id,
        stars: ((userIndex + offset + movie.id) % 5) + 1,
        comment: reviewComments[commentIndex],
      }),
    );
    existingPairs.add(pair);
    counters.reviews += 1;
  }
}

async function seed() {
  const credentials = readTmdbCredentials();
  if (!credentials.accessToken && !credentials.apiKey) {
    throw new Error(
      'Defina TMDB_ACCESS_TOKEN ou TMDB_API_KEY no arquivo .env da raiz.',
    );
  }

  const language = process.env.TMDB_LANGUAGE?.trim() || 'pt-BR';
  const pages = readPositiveInteger('TMDB_PAGES', 3, 10);
  const movieLimit = readPositiveInteger('SEED_MOVIE_LIMIT', 50, 200);
  const userCount = readPositiveInteger('SEED_USER_COUNT', 15, 100);
  const reviewCount = readPositiveInteger('SEED_REVIEW_COUNT', 100, 2_000);
  const password = process.env.SEED_USER_PASSWORD?.trim() || 'Demo@123';
  const counters: SeedCounters = {
    movies: 0,
    genres: 0,
    actors: 0,
    directors: 0,
    users: 0,
    reviews: 0,
  };

  logger.log(`Buscando até ${movieLimit} filmes no TMDB...`);
  const client = createTmdbClient(
    credentials.accessToken,
    credentials.apiKey,
  );
  const tmdbMovies = await fetchMovies(client, language, pages, movieLimit);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const dataSource = app.get(DataSource);
    const movies = await importMovies(dataSource, tmdbMovies, counters);
    const users = await createFictitiousUsers(
      dataSource,
      userCount,
      password,
      counters,
    );
    await createFictitiousReviews(
      dataSource,
      users,
      movies,
      reviewCount,
      counters,
    );

    logger.log(
      [
        'Seed concluído.',
        `${counters.movies} filmes novos`,
        `${counters.genres} gêneros novos`,
        `${counters.actors} atores novos`,
        `${counters.directors} diretores novos`,
        `${counters.users} usuários novos`,
        `${counters.reviews} críticas novas`,
      ].join(' | '),
    );
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Não foi possível executar o seed: ${message}`);
  process.exitCode = 1;
});
