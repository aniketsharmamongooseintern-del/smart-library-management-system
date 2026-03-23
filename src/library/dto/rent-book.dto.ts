import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RentBookDto {
  @ApiProperty({
    example: 'Atomic Habits',
    description: 'Book ka title jo rent karna hai'
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
