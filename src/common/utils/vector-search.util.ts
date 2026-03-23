export const findBookUsingVector = async (
  books: any[],
  message: string,
  aiService: any
) => {
  const userVector = await aiService.getEmbedding(message);

  let bestScore = -1;
  let bestBook = null;

  for (const book of books) {
    if (!book.embedding) continue;

    const score = aiService.cosineSimilarity(
      userVector,
      book.embedding.vector as number[]
    );

    if (score > bestScore) {
      bestScore = score;
      bestBook = book;
    }
  }

  console.log('VECTOR SCORE:', bestScore);

  if (bestScore < 0.6) {
    return null;
  }

  return bestBook;
};
