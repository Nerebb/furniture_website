/*
  Warnings:

  - You are about to alter the column `avgRating` on the `product` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedTinyInt`.
  - You are about to alter the column `totalComments` on the `product` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedInt`.
  - You are about to alter the column `totalRating` on the `product` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `totalSale` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `avgRating` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `totalComments` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    MODIFY `totalRating` INTEGER UNSIGNED NOT NULL DEFAULT 0;
