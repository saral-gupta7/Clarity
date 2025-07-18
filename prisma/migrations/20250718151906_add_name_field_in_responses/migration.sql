/*
  Warnings:

  - Added the required column `name` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "name" TEXT NOT NULL;
