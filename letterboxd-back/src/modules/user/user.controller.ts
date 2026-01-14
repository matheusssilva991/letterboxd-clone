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
  Req,
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
import { Request } from 'express';
import { multerConfig } from '../../../config/multer.config';
import { DeleteResponseDto } from '../../common/dto/success-response.dto';
import { UpdateResponseDto } from '../../common/dto/success-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { Roles } from '../../common/decorators/role.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { FileService } from '../file/file.service';
import { RoleGuard } from './../../common/guards/role.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller({ version: '1', path: 'users' })
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig('users')))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Criar um novo usuário (registrar)' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    if (image) {
      createUserDto.imagePath = image.path;
    }

    try {
      delete createUserDto.role;
      const user = await this.userService.create(createUserDto);
      return new UserResponseDto(user);
    } catch (error) {
      if (image) {
        this.fileService.deleteImage(image.path);
      }

      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os usuários com paginação' })
  @ApiResponse({ status: 200, description: 'Lista de usuários recuperada com sucesso', type: PaginatedResponseDto<UserResponseDto> })
  async findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    const { page, limit, skip, take } = pagination;
    const [data, total] = await this.userService.findAll(skip, take);
    const users = data.map((user) => new UserResponseDto(user));

    return new PaginatedResponseDto(users, total, page, limit);
  }

  @Get('me')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário recuperado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async findMe(@Req() request: Request): Promise<UserResponseDto> {
    const user = request.user as User;
    const userData = await this.userService.findOne(user.id);
    return new UserResponseDto(userData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário específico por ID' })
  @ApiResponse({ status: 200, description: 'Usuário recuperado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    return new UserResponseDto(user);
  }

  @Patch(':id/role')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar papel do usuário (apenas admin)' })
  @ApiResponse({ status: 200, description: 'Papel do usuário atualizado com sucesso', type: UpdateResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: Pick<UpdateUserDto, 'role'>,
  ): Promise<UpdateResponseDto> {
    const result = await this.userService.update(id, { role: updateUserDto.role });
    return new UpdateResponseDto(result.affected);
  }

  @Patch('me')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig('users')))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário atualizado com sucesso', type: UpdateResponseDto })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async updateMe(
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ): Promise<UpdateResponseDto> {
    const user = request.user as User;
    const id = user.id;

    if (image) {
      updateUserDto.imagePath = image.path;
    }

    delete updateUserDto.role;

    const result = await this.userService.update(id, updateUserDto);
    return new UpdateResponseDto(result.affected);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Proibido - Requer papel de administrador' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResponseDto> {
    const result = await this.userService.remove(id);
    return new DeleteResponseDto(result.affected);
  }
}
