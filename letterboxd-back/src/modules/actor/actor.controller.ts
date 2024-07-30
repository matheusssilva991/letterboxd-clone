import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';

@Controller('api')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Post('actor')
  async create(@Body() createActorDto: CreateActorDto): Promise<Actor> {
    return this.actorService.create(createActorDto);
  }

  @Get('actors')
  async findAll(): Promise<Actor[]> {
    return this.actorService.findAll();
  }

  @Get('actor/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Actor> {
    return this.actorService.findOne(+id);
  }

  @Patch('actor/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: UpdateActorDto,
  ): Promise<UpdateResult> {
    return this.actorService.update(+id, updateActorDto);
  }

  @Delete('actor/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.actorService.remove(+id);
  }
}
