import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { DeleteResult, Repository, UpdateResult } from 'typeorm';
  import { CreateActorDto } from './dto/create-actor.dto';
  import { UpdateActorDto } from './dto/update-actor.dto';
  import { Actor } from './entities/actor.entity';
  
  @Injectable()
  export class ActorService {
    constructor(
      @InjectRepository(Actor)
      private readonly actorRepository: Repository<Actor>,
    ) {}
  
    // cria o nome do ator/atriz.. antes de criar ele procura se ja existe
    async create(createActorDto: CreateActorDto): Promise<Actor> {
      if (await this.findByName(CreateActorDto.name)) {
        throw new BadRequestException('Ator/Atriz já cadastrado(a).');
      }
  
      return this.actorRepository.save(createActorDto);
    }
  
    // procura por todos os nomes do ator/atriz
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
      // verificar se o ator/atriz existe antes de atualizar
      await this.findOne(id);
      const actorByName = await this.findByName(updateActorDto.name);
  
      if (!actorByName) {
        throw new Error('Ator/Atriz não encontrado(a).');
      }
  
      if (actorByName && actorByName.id !== id) {
        throw new BadRequestException('Ator/Atriz já cadastrado(a).');
      }
  
      return this.actorRepository.update(id, updateActorDto);
    }
  
    async remove(id: number): Promise<DeleteResult> {
      await this.findOne(id);
  
      return await this.actorRepository.delete(id);
    }
  
    // procura pelo nome do ator/atriz
    async findByName(name: string): Promise<Actor> {
      return this.actorRepository.findOne({ where: { name } });
    }
  }
  