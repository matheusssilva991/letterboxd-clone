/**
 * Service de Filmes
 *
 * Responsável por toda a lógica de negócio relacionada a filmes:
 * - CRUD completo de filmes
 * - Busca com filtros e paginação
 * - Gerenciamento de imagens de filmes
 * - Inclusão de relações (atores, diretores, gêneros)
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, UpdateResult } from 'typeorm';
import { parseOrder } from '../../common/helpers/query.helper';
import { FileService } from '../file/file.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MoviesQueryDto } from './dto/movies-query.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly fileService: FileService,
  ) {}

  /**
   * Cria um novo filme no banco de dados
   *
   * @param createMovieDto - Dados do filme a ser criado
   * @returns Filme criado com ID gerado
   */
  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return await this.movieRepository.save(createMovieDto);
  }

  /**
   * Busca todos os filmes, com ou sem filtros
   *
   * @param query - Parâmetros opcionais de busca e paginação
   * @returns Lista de filmes encontrados
   */
  async findAll(query?: MoviesQueryDto): Promise<Movie[]> {
    // Se não houver parâmetros de query, retorna todos os filmes
    if (Object.keys(query).length) {
      return this.findAllWithFilter(query);
    } else {
      return this.movieRepository.find();
    }
  }

  /**
   * Busca filmes aplicando filtros, paginação e ordenação
   *
   * @param query - Parâmetros de busca (título, sinopse, paginação, ordenação, etc)
   * @returns Lista de filmes filtrados
   * @private
   */
  async findAllWithFilter(query: MoviesQueryDto) {
    // Constrói o objeto de filtros dinamicamente
    const filter = {
      // Busca parcial por título (case-insensitive)
      ...(query.title && { title: ILike(`%${query.title}%`) }),
      // Busca parcial por sinopse (case-insensitive)
      ...(query.synopsis && {
        synopsis: ILike(`%${query.synopsis}%`),
      }),
    };

    // Define quais relações devem ser carregadas (atores, diretores, gêneros, etc)
    // Exemplo: ?include=actors,genres
    const relations: string[] = query.include ? query.include.split(',') : [];

    return await this.movieRepository.find({
      where: filter,                                      // Aplica os filtros
      order: parseOrder(query.order),                     // Aplica ordenação (ex: createdAt:DESC)
      take: query.limit || undefined,                     // Limita número de resultados
      skip: (query.page - 1) * query.limit || 0,         // Calcula offset para paginação
      relations,                                          // Carrega relações solicitadas
    });
  }

  /**
   * Busca um filme específico por ID
   *
   * @param id - ID do filme
   * @param query - Parâmetros opcionais (como relações a incluir)
   * @returns Filme encontrado
   * @throws NotFoundException se o filme não existir
   */
  async findOne(id: number, query?: MovieQueryDto): Promise<Movie> {
    // Define quais relações devem ser carregadas
    const relations: string[] = query?.include ? query.include.split(',') : [];

    try {
      return await this.movieRepository.findOneOrFail({
        where: { id },
        relations: relations,
      });
    } catch (error) {
      throw new NotFoundException('Filme não encontrado.');
    }
  }

  /**
   * Atualiza um filme existente
   *
   * @param id - ID do filme a ser atualizado
   * @param updateMovieDto - Dados atualizados do filme
   * @returns Resultado da operação de update
   * @throws NotFoundException se o filme não existir
   */
  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<UpdateResult> {
    // Verifica se o filme existe
    const movie = await this.findOne(id);

    // Se uma nova imagem foi enviada e é diferente da anterior
    // deleta a imagem antiga do sistema de arquivos
    if (
      updateMovieDto.imagePath &&
      movie.imagePath !== updateMovieDto.imagePath
    ) {
      await this.fileService.deleteImage(movie.imagePath);
    }

    // Atualiza o filme no banco de dados
    return await this.movieRepository.update(id, updateMovieDto);
  }

  /**
   * Remove um filme do banco de dados
   *
   * @param id - ID do filme a ser removido
   * @returns Resultado da operação de delete
   * @throws NotFoundException se o filme não existir
   */
  async remove(id: number): Promise<DeleteResult> {
    // Verifica se o filme existe e busca seus dados
    const movie = await this.findOne(id);

    // Se o filme possui uma imagem, deleta do sistema de arquivos
    if (movie.imagePath) {
      await this.fileService.deleteImage(movie.imagePath);
    }

    // Remove o filme do banco de dados
    return await this.movieRepository.delete(id);
  }
}
