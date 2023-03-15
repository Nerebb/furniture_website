/*
  Warnings:

  - You are about to alter the column `subTotal` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `MediumInt`.
  - You are about to alter the column `total` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Int` to `MediumInt`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `subTotal` MEDIUMINT NOT NULL,
    MODIFY `total` MEDIUMINT NOT NULL;
