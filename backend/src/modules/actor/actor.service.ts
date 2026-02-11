import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, UpdateResult } from 'typeorm';
import { parseOrder } from '../../common/helpers/query.helper';
import { FileService } from '../file/file.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';
import { ActorQueryDto } from './dto/actor-query.dto';
import { ActorsQueryDto } from './dto/actors-query.dto';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
    private readonly fileService: FileService,
  ) {}

  async create(createActorDto: CreateActorDto): Promise<Actor> {
    return this.actorRepository.save(createActorDto);
  }

  async findAll(
    query?: ActorsQueryDto,
    skip?: number,
    take?: number,
  ): Promise<[Actor[], number]> {
    const filter = {
      ...(query?.name && { name: ILike(`%${query.name}%`) }),
      ...(query?.description && {
        description: ILike(`%${query.description}%`),
      }),
    };

    // Trazer dados dos filmes relacionados
    const relations: string[] = query?.include ? query.include.split(',') : [];

    return await this.actorRepository.findAndCount({
      where: Object.keys(filter).length ? filter : {},
      order: query?.order ? parseOrder(query.order) : { id: 'ASC' },
      take,
      skip,
      relations,
    });
  }

  async findOne(id: number, query?: ActorQueryDto): Promise<Actor> {
    try {
      return await this.actorRepository.findOneOrFail({
        where: { id },
        relations: query.include ? query.include.split(',') : [],
      });
    } catch (error) {
      throw new NotFoundException('Ator/Atriz não encontrado(a).');
    }
  }

  async findByName(name: string): Promise<Actor> {
    return this.actorRepository.findOne({ where: { name } });
  }

  async update(
    id: number,
    updateActorDto: UpdateActorDto,
  ): Promise<UpdateResult> {
    const actor = await this.findOne(id);

    if (
      updateActorDto.imagePath &&
      actor.imagePath !== updateActorDto.imagePath
    ) {
      await this.fileService.deleteImage(actor.imagePath);
    }

    return this.actorRepository.update(id, updateActorDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const actor = await this.findOne(id);

    if (actor.imagePath) {
      await this.fileService.deleteImage(actor.imagePath);
    }

    return await this.actorRepository.delete(id);
  }
}
