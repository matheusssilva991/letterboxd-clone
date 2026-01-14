import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { multerConfig } from '../../../config/multer.config';
import { DeleteResponseDto } from '../../common/dto/success-response.dto';
import { UpdateResponseDto } from '../../common/dto/success-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { FileService } from '../file/file.service';
import { ActorService } from './actor.service';
import { ActorQueryDto } from './dto/actor-query.dto';
import { ActorsQueryDto } from './dto/actors-query.dto';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';

@ApiTags('actors')
@Controller({ version: '1', path: 'actors' })
export class ActorController {
  constructor(
    private readonly actorService: ActorService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
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
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() query: ActorsQueryDto,
  ): Promise<PaginatedResponseDto<Actor>> {
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.actorService.findAll(query, skip, take);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ActorQueryDto,
  ): Promise<Actor> {
    return this.actorService.findOne(+id, query);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('actors')))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateActorDto: UpdateActorDto,
  ): Promise<UpdateResponseDto> {
    if (image) {
      updateActorDto.imagePath = image.path;
    }
    const result = await this.actorService.update(+id, updateActorDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    const result = await this.actorService.remove(+id);
    return new DeleteResponseDto(result.affected);
  }
}
