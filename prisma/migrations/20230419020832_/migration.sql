/*
  Warnings:

  - You are about to drop the `_productlikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_productlikes` DROP FOREIGN KEY `_productLikes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_productlikes` DROP FOREIGN KEY `_productLikes_B_fkey`;

-- DropTable
DROP TABLE `_productlikes`;

-- CreateTable
CREATE TABLE `_reviewLikes` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_reviewLikes_AB_unique`(`A`, `B`),
    INDEX `_reviewLikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_reviewLikes` ADD CONSTRAINT `_reviewLikes_A_fkey` FOREIGN KEY (`A`) REFERENCES `productreview`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_reviewLikes` ADD CONSTRAINT `_reviewLikes_B_fkey` FOREIGN KEY (`B`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
