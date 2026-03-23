import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  Patch
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateBookDto } from './dto/create-book.dto';
import { RentBookDto } from './dto/rent-book.dto';
import { JwtAuthGuard, AuthenticatedRequest } from '@Common';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';

@ApiTags('Library')
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('books')
  @ApiBody({ type: CreateBookDto })
  createBook(@Body() dto: CreateBookDto) {
    return this.libraryService.createBook(dto);
  }

  @Get('books')
  @ApiQuery({ name: 'available', required: false, example: 'true' })
  getBooks(@Query('available') available?: string) {
    return this.libraryService.getAllBooks(available === 'true');
  }

  @Delete('books/:id')
  @ApiParam({ name: 'id', example: 1 })
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.libraryService.deleteBook(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('books/:id')
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateBookDto })
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto
  ) {
    return this.libraryService.updateBook(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('rent')
  @ApiBody({ type: RentBookDto })
  rentBook(@Req() req: AuthenticatedRequest, @Body() dto: RentBookDto) {
    return this.libraryService.rentBook(req.user.id, dto.title);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('return')
  @ApiBody({
    schema: {
      example: { title: 'Atomic Habits' }
    }
  })
  returnBook(
    @Req() req: AuthenticatedRequest,
    @Body() body: { title: string }
  ) {
    return this.libraryService.returnBookByTitle(req.user.id, body.title);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-rentals')
  getMyRentals(@Req() req: AuthenticatedRequest) {
    return this.libraryService.getUserRentals(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('rentals')
  getAllRentals() {
    return this.libraryService.getAllRentals();
  }

  @Get('who-rented')
  @ApiQuery({ name: 'title', example: 'Atomic Habits' })
  whoRented(@Query('title') title: string) {
    return this.libraryService.whoRented(title);
  }

  @Get('availability')
  @ApiQuery({ name: 'title', example: 'Atomic Habits' })
  checkAvailability(@Query('title') title: string) {
    return this.libraryService.checkAvailability(title);
  }

  @Get('due-date')
  @ApiQuery({ name: 'title', example: 'Atomic Habits' })
  getDueDate(@Query('title') title: string) {
    return this.libraryService.getDueDate(title);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('reserve')
  @ApiBody({
    schema: {
      example: { title: 'Atomic Habits' }
    }
  })
  reserveBook(
    @Req() req: AuthenticatedRequest,
    @Body() body: { title: string }
  ) {
    return this.libraryService.reserveBook(req.user.id, body.title);
  }

  @Get('search')
  @ApiQuery({ name: 'title', example: 'Atomic Habits' })
  findBook(@Query('title') title: string) {
    return this.libraryService.findBookByTitle(title);
  }
}
