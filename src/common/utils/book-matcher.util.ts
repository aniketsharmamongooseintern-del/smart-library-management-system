export const extractBookFromMessage = (books: any[], message: string) => {
  const text = message.toLowerCase();

  for (const book of books) {
    const title = book.title.toLowerCase();

    if (text.includes(title)) {
      return book;
    }

    const words = title.split(' ');
    for (const word of words) {
      if (text.includes(word)) {
        return book;
      }
    }
  }

  return null;
};
