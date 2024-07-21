import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    if (await this.findByName(createGenreDto.name)) {
      throw new BadRequestException('Gênero já cadastrado.');
    }

    return this.genreRepository.save(createGenreDto);
  }

  async findAll() {
    return this.genreRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.genreRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Gênero não encontrado.');
    }
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    // verificar se o gênero existe antes de atualizar
    await this.findOne(id);

    const genreByName = await this.findByName(updateGenreDto.name);

    if (genreByName && genreByName.id !== id) {
      throw new BadRequestException('Gênero já cadastrado.');
    }

    return this.genreRepository.update(id, updateGenreDto);
  }

  async remove(id: number) {
    // verificar se o gênero existe antes de deletar
    await this.findOne(id);

    return this.genreRepository.delete(id);
  }

  async findByName(name: string) {
    return this.genreRepository.findOne({ where: { name } });
  }
}
