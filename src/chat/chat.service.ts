import { Injectable } from '@nestjs/common';
import { NlpService } from './nlp.service';
import { LibraryService } from 'src/library/library.service';
import { AiService } from 'src/ai/ai.service';
import { extractBookFromMessage } from '../common/utils/book-matcher.util';
import { findBookUsingVector } from '../common/utils/vector-search.util';

@Injectable()
export class ChatService {
  constructor(
    private readonly nlpService: NlpService,
    private readonly libraryService: LibraryService,
    private readonly aiService: AiService
  ) {}

  async handleMessage(message: string, userId: number) {
    const intent = await this.nlpService.detectIntent(message);

    const books = await this.libraryService.getAllBooks();

    let book = await findBookUsingVector(books, message, this.aiService);

    if (!book) {
      book = extractBookFromMessage(books, message);
    }

    if (!book) {
      return { message: 'not clearly understand please chck spelling' };
    }

    if (intent === 'availability') {
      return this.libraryService.checkAvailability(book.title);
    }

    if (intent === 'who_rented') {
      return this.libraryService.whoRented(book.title);
    }

    if (intent === 'due_date') {
      return this.libraryService.getDueDate(book.title);
    }

    if (intent === 'reserve') {
      return this.libraryService.reserveBook(userId, book.title);
    }

    if (intent === 'rent') {
      return this.libraryService.rentBook(userId, book.title);
    }
    if (intent === 'return_all') {
      return this.libraryService.returnAllBooks(userId);
    }
    if (intent === 'return') {
      return this.libraryService.returnBookByTitle(userId, book.title);
    }
    return this.libraryService.checkAvailability(book.title);
  }
}
