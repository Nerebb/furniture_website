/*
  Warnings:

  - Added the required column `totalLike` to the `productreview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productreview` ADD COLUMN `totalLike` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `_productLikes` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_productLikes_AB_unique`(`A`, `B`),
    INDEX `_productLikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_productLikes` ADD CONSTRAINT `_productLikes_A_fkey` FOREIGN KEY (`A`) REFERENCES `productreview`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_productLikes` ADD CONSTRAINT `_productLikes_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
