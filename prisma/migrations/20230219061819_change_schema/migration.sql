/*
 Warnings:
 
 - You are about to drop the column `name` on the `account` table. All the data in the column will be lost.
 - You are about to drop the column `password` on the `account` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE `account` DROP COLUMN `name`,
  DROP COLUMN `password`;
-- AlterTable
ALTER TABLE `user`
ADD COLUMN `loginId` VARCHAR(191) NULL,
  ADD COLUMN `password` VARCHAR(191) NULL;