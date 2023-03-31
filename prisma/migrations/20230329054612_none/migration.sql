/*
  Warnings:

  - Made the column `price` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `available` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `JsonColor` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `price` INTEGER NOT NULL DEFAULT 0,
    MODIFY `available` INTEGER NOT NULL DEFAULT 0,
    MODIFY `JsonColor` JSON NOT NULL;
