/*
  Warnings:

  - A unique constraint covering the columns `[nickName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `birthDay` DATETIME(3) NULL,
    ADD COLUMN `createdDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `gender` ENUM('male', 'female', 'others') NOT NULL DEFAULT 'others',
    ADD COLUMN `nickName` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` INTEGER NOT NULL,
    ADD COLUMN `role` ENUM('admin', 'creator', 'customer') NOT NULL DEFAULT 'customer',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_nickName_key` ON `User`(`nickName`);

-- CreateIndex
CREATE UNIQUE INDEX `User_phoneNumber_key` ON `User`(`phoneNumber`);
