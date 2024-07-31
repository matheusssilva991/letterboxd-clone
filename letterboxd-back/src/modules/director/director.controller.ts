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
  import { DirectorService } from './director.service';
  import { CreateDirectorDto } from './dto/create-director.dto';
  import { UpdateDirectorDto } from './dto/update-director.dto';
  import { Director } from './entities/director.entity';
  
  @Controller('api')
  export class DirectorController {
    constructor(private readonly actorService: DirectorService) {}
  
    @Post('director')
    async create(@Body() createDirectorDto: CreateDirectorDto): Promise<Director> {
      return this.directorService.create(createDirectorDto);
    }
  
  }