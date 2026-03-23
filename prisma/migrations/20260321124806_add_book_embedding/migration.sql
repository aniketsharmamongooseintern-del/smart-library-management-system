-- CreateTable
CREATE TABLE "BookEmbedding" (
    "id" SERIAL NOT NULL,
    "vector" JSONB NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "BookEmbedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookEmbedding_bookId_key" ON "BookEmbedding"("bookId");

-- AddForeignKey
ALTER TABLE "BookEmbedding" ADD CONSTRAINT "BookEmbedding_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
