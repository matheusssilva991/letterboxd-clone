import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { FileService } from '../file/file.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';

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

  async findAll(): Promise<Actor[]> {
    return this.actorRepository.find();
  }

  async findOne(id: number): Promise<Actor> {
    try {
      return await this.actorRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Ator/Atriz não encontrado(a).');
    }
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

  async findByName(name: string): Promise<Actor> {
    return this.actorRepository.findOne({ where: { name } });
  }
}
