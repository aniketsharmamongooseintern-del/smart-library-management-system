-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('user', 'librarian');

-- AlterTable
ALTER TABLE "book" ALTER COLUMN "price" SET DEFAULT 1.0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "user_role" NOT NULL DEFAULT 'user';
