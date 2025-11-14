-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "fullName" TEXT;

-- CreateTable
CREATE TABLE "FrequentQuestion" (
    "id" SERIAL NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "answerAr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrequentQuestion_pkey" PRIMARY KEY ("id")
);
