import {
  Injectable,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async createBook(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  async getAllBooks(onlyAvailable?: boolean) {
    return this.prisma.book.findMany({
      where: onlyAvailable ? { isAvailable: true } : {},
      orderBy: { createdAt: 'desc' },
      include: { embedding: true }
    });
  }
  async getsAllBooks() {
    return this.prisma.book.findMany({
      orderBy: { createdAt: 'asc' }
    });
  }
  async deleteBook(id: number) {
    const activeRental = await this.prisma.rental.findFirst({
      where: { bookId: id, returnedAt: null }
    });

    if (activeRental) {
      throw new BadRequestException('Book is currently rented');
    }

    return this.prisma.book.delete({ where: { id } });
  }

  async rentBook(userId: number, title: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    console.log(this.rentBook);
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findFirst({
        where: {
          title: { equals: title, mode: 'insensitive' },
          isAvailable: true
        }
      });

      if (!book) {
        throw new BadRequestException('No copies available');
      }

      const dueDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

      await tx.book.update({
        where: { id: book.id },
        data: { isAvailable: false }
      });

      return tx.rental.create({
        data: {
          userId,
          bookId: book.id,
          dueDate
        }
      });
    });
  }

  async getAllRentals() {
    return this.prisma.rental.findMany({
      include: { user: true, book: true },
      orderBy: { rentedAt: 'desc' }
    });
  }

  async returnBook(userId: number, bookId: number) {
    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.findFirst({
        where: {
          bookId,
          userId,
          returnedAt: null
        }
      });

      if (!rental) {
        throw new BadRequestException(
          'You have not rented this book or already returned'
        );
      }

      const now = new Date();

      await tx.rental.update({
        where: { id: rental.id },
        data: { returnedAt: now }
      });

      const nextUser = await tx.waitlist.findFirst({
        where: { bookId },
        orderBy: { position: 'asc' }
      });

      if (nextUser) {
        const dueDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);

        await tx.rental.create({
          data: {
            userId: nextUser.userId,
            bookId,
            rentedAt: new Date(),
            dueDate
          }
        });

        await tx.waitlist.delete({
          where: { id: nextUser.id }
        });

        return {
          message: `Book assigned to next user ${nextUser.userId}`,
          assignedTo: nextUser.userId
        };
      }

      await tx.book.update({
        where: { id: bookId },
        data: { isAvailable: true }
      });

      return {
        message: 'Book returned successfully'
      };
    });
  }

  async getUserRentals(userId: number) {
    return this.prisma.rental.findMany({
      where: { userId },
      include: { book: true },
      orderBy: { rentedAt: 'desc' }
    });
  }

  async getBookRentals(bookId: number) {
    return this.prisma.rental.findMany({
      where: { bookId },
      include: { user: true }
    });
  }

  async updateBook(id: number, dto: UpdateBookDto) {
    const existingBook = await this.prisma.book.findUnique({
      where: { id }
    });

    if (!existingBook) {
      throw new NotFoundException('Book not found');
    }

    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided to update');
    }

    const updatedBook = await this.prisma.book.update({
      where: { id },
      data: dto
    });

    return {
      message: 'Book updated successfully',
      data: updatedBook
    };
  }

  async findBookByTitle(title: string) {
    return this.prisma.book.findMany({
      where: {
        title: { contains: title, mode: 'insensitive' }
      }
    });
  }

  async checkAvailability(title: string) {
    const count = await this.prisma.book.count({
      where: {
        title: { contains: title, mode: 'insensitive' },
        isAvailable: true
      }
    });

    return {
      title,
      availableCopies: count
    };
  }

  async whoRented(title: string) {
    const rentals = await this.prisma.rental.findMany({
      where: {
        book: {
          title: { contains: title, mode: 'insensitive' }
        },
        returnedAt: null
      },
      include: { user: true, book: true }
    });

    return rentals.map((r) => ({
      user: r.user.email,
      bookId: r.bookId
    }));
  }

  async getDueDate(title: string) {
    const rentals = await this.prisma.rental.findMany({
      where: {
        book: {
          title: { contains: title, mode: 'insensitive' }
        },
        returnedAt: null
      }
    });

    if (rentals.length === 0) {
      return { message: 'Book available' };
    }

    return rentals.map((r) => ({
      bookId: r.bookId,
      dueDate: r.dueDate
    }));
  }

  async reserveBook(userId: number, title: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) throw new NotFoundException('User not found');

    const book = await this.prisma.book.findFirst({
      where: {
        title: { equals: title, mode: 'insensitive' }
      }
    });

    if (!book) throw new NotFoundException('Book not found');

    if (book.isAvailable) {
      return { message: 'Book available, directly rent karo' };
    }

    const existing = await this.prisma.waitlist.findFirst({
      where: { userId, bookId: book.id }
    });

    if (existing) {
      return { message: 'Already in waitlist' };
    }

    const count = await this.prisma.waitlist.count({
      where: { bookId: book.id }
    });

    const wait = await this.prisma.waitlist.create({
      data: {
        userId,
        bookId: book.id,
        position: count + 1
      }
    });

    return {
      message: 'Added to waitlist',
      position: wait.position
    };
  }

  async returnBookByTitle(userId: number, title: string) {
    const rental = await this.prisma.rental.findFirst({
      where: {
        userId,
        returnedAt: null,
        book: {
          title: { equals: title, mode: 'insensitive' }
        }
      }
    });

    if (!rental) {
      throw new BadRequestException('You have not rented this book');
    }

    return this.returnBook(userId, rental.bookId);
  }

  async returnAllBooks(userId: number) {
    const rentals = await this.prisma.rental.findMany({
      where: { userId, returnedAt: null }
    });

    if (rentals.length === 0) {
      return { message: 'No active rentals found' };
    }

    await Promise.all(rentals.map((r) => this.returnBook(userId, r.bookId)));

    return {
      message: 'All books returned successfully',
      count: rentals.length
    };
  }
}
