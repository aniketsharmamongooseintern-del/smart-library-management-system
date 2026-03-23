import { Injectable, OnModuleInit } from '@nestjs/common';
import { pipeline } from '@xenova/transformers';

@Injectable()
export class AiService implements OnModuleInit {
  private extractor: any;

  async onModuleInit() {
    this.extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  async getEmbedding(text: string): Promise<number[]> {
    const output = await this.extractor(text);
    return output.data[0];
  }
  cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    return dot / (magA * magB);
  }
  async findBestBook(message: string, prisma: any) {
    const userVector = await this.getEmbedding(message);

    const books = await prisma.book.findMany({
      include: { embedding: true }
    });

    let bestScore = -1;
    let bestBook = null;

    for (const book of books) {
      if (!book.embedding) continue;

      const score = this.cosineSimilarity(
        userVector,
        book.embedding.vector as number[]
      );

      if (score > bestScore) {
        bestScore = score;
        bestBook = book;
      }
    }

    if (bestScore < 0.7) return null;

    return bestBook;
  }
}
