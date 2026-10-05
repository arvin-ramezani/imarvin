-- CreateEnum
CREATE TYPE "StoryProgress" AS ENUM ('ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "problem" TEXT NOT NULL DEFAULT '',
    "contribution" TEXT NOT NULL DEFAULT '',
    "progress" "StoryProgress",
    "outcome" TEXT,
    "stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "workingRevision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublishedStory" (
    "storyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "contribution" TEXT NOT NULL,
    "progress" "StoryProgress" NOT NULL,
    "outcome" TEXT,
    "stack" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "revision" INTEGER NOT NULL DEFAULT 1,
    "sourceWorkingRevision" INTEGER NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublishedStory_pkey" PRIMARY KEY ("storyId")
);

-- AddForeignKey
ALTER TABLE "PublishedStory" ADD CONSTRAINT "PublishedStory_storyId_fkey"
FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
