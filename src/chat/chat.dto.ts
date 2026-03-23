import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChatDto {
  @ApiProperty({ example: 'java basic book hai kya' })
  @IsString()
  message: string;
}
