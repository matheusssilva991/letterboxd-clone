import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    description: 'Indica se a operação foi bem-sucedida',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Operação realizada com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Número de registros afetados',
    example: 1,
    required: false,
  })
  affected?: number;

  constructor(message: string, affected?: number) {
    this.success = true;
    this.message = message;
    if (affected !== undefined) {
      this.affected = affected;
    }
  }
}

export class DeleteResponseDto extends SuccessResponseDto {
  constructor(affected: number = 1) {
    super('Registro deletado com sucesso', affected);
  }
}

export class UpdateResponseDto extends SuccessResponseDto {
  constructor(affected: number = 1) {
    super('Registro atualizado com sucesso', affected);
  }
}
