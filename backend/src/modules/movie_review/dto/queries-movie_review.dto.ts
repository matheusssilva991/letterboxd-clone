import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class MovieReviewQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'ID do filme para filtrar reviews (opcional)',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt({ message: 'ID do filme deve ser um número inteiro.' })
  @IsPositive({ message: 'ID do filme deve ser positivo.' })
  @IsOptional()
  movieId?: number;
}
