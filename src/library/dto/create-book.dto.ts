import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ description: 'Enter book title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Enter author name' })
  @IsString()
  author: string;

  @ApiPropertyOptional({ description: 'Enter book price' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Enter quantity of books' })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
