import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, UpdateResult } from 'typeorm';
import { parseOrder } from '../../common/helpers/query.helper';
import { FileService } from './../file/file.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { DirectorQueryDto } from './dto/director-query.dto';
import { DirectorsQueryDto } from './dto/directors-query.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    private readonly fileService: FileService,
  ) {}

  async create(createDirectorDto: CreateDirectorDto): Promise<Director> {
    return this.directorRepository.save(createDirectorDto);
  }

  async findAll(query?: DirectorsQueryDto): Promise<Director[]> {
    if (Object.keys(query).length) {
      return this.findAllWithFilter(query);
    } else {
      return this.directorRepository.find();
    }
  }

  async findAllWithFilter(query: DirectorsQueryDto) {
    const filter = {
      ...(query.name && { name: ILike(`%${query.name}%`) }),
      ...(query.description && {
        description: ILike(`%${query.description}%`),
      }),
    };

    // Trazer dados dos filmes relacionados
    const relations: string[] = query.include ? query.include.split(',') : [];

    return await this.directorRepository.find({
      where: filter,
      order: parseOrder(query.order),
      take: query.limit || undefined,
      skip: (query.page - 1) * query.limit || 0,
      relations,
    });
  }

  async findOne(id: number, query?: DirectorQueryDto): Promise<Director> {
    try {
      return await this.directorRepository.findOneOrFail({
        where: { id },
        relations: query.include ? query.include.split(',') : [],
      });
    } catch (error) {
      throw new NotFoundException('Diretor/Diretora não encontrado(a).');
    }
  }

  async update(
    id: number,
    updateDirectorDto: UpdateDirectorDto,
  ): Promise<UpdateResult> {
    const director = await this.findOne(id);

    if (
      updateDirectorDto.imagePath &&
      director.imagePath !== updateDirectorDto.imagePath
    ) {
      await this.fileService.deleteImage(director.imagePath);
    }

    return this.directorRepository.update(id, updateDirectorDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const director = await this.findOne(id);

    if (director.imagePath) {
      await this.fileService.deleteImage(director.imagePath);
    }

    return await this.directorRepository.delete(id);
  }

  async findByName(name: string): Promise<Director> {
    return this.directorRepository.findOne({ where: { name } });
  }
}
