/*
  Warnings:

  - You are about to drop the column `color` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `color`;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `color` JSON NULL;
