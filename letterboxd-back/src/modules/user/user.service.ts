import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdatePasswordDto } from '../auth/dto/update-password.dto';
import { FileService } from '../file/file.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from '../auth/dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifica se o e-mail já está cadastrado
    if (await this.emailAlreadyExists(createUserDto.email)) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    // Verifica se o nome de usuário já está cadastrado
    if (await this.usernameAlreadyExists(createUserDto.username)) {
      throw new ConflictException('Nome de usuário já cadastrado.');
    }

    // Criptografa a senha
    const saltOrRounds = 10;
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // Cria o usuário
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const user = await this.findOne(id);

    // Verifica se o e-mail já está cadastrado caso o e-mail tenha sido alterado
    if (updateUserDto.email && user.email !== updateUserDto.email) {
      if (await this.emailAlreadyExists(updateUserDto.email)) {
        throw new ConflictException('E-mail já cadastrado.');
      }
    }

    // Verifica se o nome de usuário já está cadastrado caso o nome de usuário tenha sido alterado
    if (updateUserDto.username && user.username !== updateUserDto.username) {
      if (await this.usernameAlreadyExists(updateUserDto.username)) {
        throw new ConflictException('Nome de usuário já cadastrado.');
      }
    }

    // Criptografa a senha caso a senha tenha sido alterada
    if (updateUserDto.password) {
      const saltOrRounds = 10;
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }

    // Deleta a imagem antiga se uma nova imagem for enviada
    if (updateUserDto.imagePath && user.imagePath !== updateUserDto.imagePath) {
      await this.fileService.deleteImage(user.imagePath);
    }

    // Atualiza o usuário
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const user = await this.findOne(id);

    if (user.imagePath) {
      await this.fileService.deleteImage(user.imagePath);
    }

    return await this.userRepository.delete(id);
  }

  async emailAlreadyExists(email: string): Promise<boolean> {
    return !!(await this.findByEmail(email));
  }

  async usernameAlreadyExists(username: string): Promise<boolean> {
    return !!(await this.findByUsername(username));
  }

  async validateLogin({
    email,
    password,
  }: LoginUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'username', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException('E-mail não encontrado.');
    }

    const areEqual = await bcrypt.compare(password, user.password);

    if (!areEqual) {
      throw new UnauthorizedException('Senha incorreta.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...rest } = user;
    return rest;
  }

  async updatePassword(
    id: number,
    payload: UpdatePasswordDto,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: { password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // compare passwords
    const areEqual = await bcrypt.compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    payload.new_password = await bcrypt.hash(payload.new_password, 10);
    user.password = payload.new_password;

    return await this.userRepository.update(id, user);
  }
}
