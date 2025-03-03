import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteResult, UpdateResult } from 'typeorm';
import { multerConfig } from '../../../config/multer.config';
import { ActorService } from './actor.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';
import { FileService } from '../file/file.service';

@Controller({ version: '1', path: 'actors' })
export class ActorController {
  constructor(
    private readonly actorService: ActorService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig('actors')))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createActorDto: CreateActorDto,
  ): Promise<Actor> {
    if (image) {
      createActorDto.imagePath = image.path;
    }
    try {
      return await this.actorService.create(createActorDto);
    } catch (error) {
      this.fileService.deleteImage(image.path);

      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Actor[]> {
    return this.actorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Actor> {
    return this.actorService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig('actors')))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: UpdateActorDto,
  ): Promise<UpdateResult> {
    if (image) {
      updateActorDto.imagePath = image.path;
    }
    return this.actorService.update(+id, updateActorDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.actorService.remove(+id);
  }
}
