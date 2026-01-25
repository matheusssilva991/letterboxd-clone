import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer'; 

export class UserPayloadDto {
  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'jwt.token.here' })
  @Expose()
  access_token: string;

  @ApiProperty({ example: 'refresh.jwt.token.here' })
  @Expose()
  refresh_token: string;

  @ApiProperty({ example: '3600s' })
  @Expose()
  expiresIn: string;

  @ApiProperty({
    example: {
      username: 'john',
      email: 'john@email.com',
    },
  })
  @Expose()
  @Type(() => UserPayloadDto)
  user: UserPayloadDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}