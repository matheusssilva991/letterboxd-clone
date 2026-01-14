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
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { DirectorQueryDto } from './dto/director-query.dto';
import { DirectorsQueryDto } from './dto/directors-query.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { Director } from './entities/director.entity';

@ApiTags('directors')
@Controller({ version: '1', path: 'directors' })
export class DirectorController {
  constructor(
    private readonly directorService: DirectorService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('directors')))
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createDirectorDto: CreateDirectorDto,
  ): Promise<Director> {
    if (image) {
      createDirectorDto.imagePath = image.path;
    }
    try {
      return await this.directorService.create(createDirectorDto);
    } catch (error) {
      this.fileService.deleteImage(image.path);

      throw error;
    }
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query() query: DirectorsQueryDto,
  ): Promise<PaginatedResponseDto<Director>> {
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.directorService.findAll(query, skip, take);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: DirectorQueryDto,
  ): Promise<Director> {
    return this.directorService.findOne(+id, query);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('directors')))
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ): Promise<UpdateResponseDto> {
    if (image) {
      updateDirectorDto.imagePath = image.path;
    }

    const result = await this.directorService.update(+id, updateDirectorDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    const result = await this.directorService.remove(+id);
    return new DeleteResponseDto(result.affected);
  }
}
