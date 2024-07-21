import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';

import { Actor } from './entities/actor.entity'

@Injectable()

export class ActorService {

  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  // procura pelo nome do ator/atriz
  async findByName(name: string) {
      return this.actorRepository.findOne({ where: { name } });
    }

  // cria o nome do ator/atriz.. antes de criar ele procura se ja existe
  async create(createActorDto: CreateActorDto) {
    if (await this.findByName(CreateActorDto.name)) {
      throw new BadRequestException('Esse ator/atriz já está cadastrado.');
    }

    return this.actorRepository.save(createActorDto);
  }

  // procura por todos os nomes do ator/atriz
  async findAll() {
    return this.actorRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.actorRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Ator/atriz não foi encontrado.');
    }
  }

  async  update(id: number, updateActorDto: UpdateActorDto) {
    const actorByName = await this.findByName(updateActorDto.name);
      if (!actorByName){
        throw new Error('Esse ator/atriz não foi encontrado!');
      }
      return this.actorRepository.update(id, updateActorDto);

  }

  async remove(id: number) {
    const actor = await this.actorRepository.findOneBy({ id });
        if (!actor) {
          throw new Error('Esse ator/atriz não foi encontrado!');
        }
        await this.actorRepository.remove(actor);
        return `Esse ator/atriz #${id} foi removido! `;
  }
}
