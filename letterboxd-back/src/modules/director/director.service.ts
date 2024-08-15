import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async create(createDirectorDto: CreateDirectorDto): Promise<Director> {
    return this.directorRepository.save(createDirectorDto);
  }

  async findAll(): Promise<Director[]> {
    return this.directorRepository.find();
  }

  async findOne(id: number): Promise<Director> {
    try {
      return await this.directorRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Diretor/Diretora não encontrado(a).');
    }
  }

  async update(
    id: number,
    updateDirectorDto: UpdateDirectorDto,
  ): Promise<UpdateResult> {
    await this.findOne(id);
    return this.directorRepository.update(id, updateDirectorDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    await this.findOne(id);

    return await this.directorRepository.delete(id);
  }

  async findByName(name: string): Promise<Director> {
    return this.directorRepository.findOne({ where: { name } });
  }
}
