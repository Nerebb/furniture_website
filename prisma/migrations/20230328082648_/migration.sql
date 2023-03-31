/*
  Warnings:

  - You are about to drop the column `productId` on the `shoppingcartitem` table. All the data in the column will be lost.
  - Added the required column `subTotal` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ShoppingCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shoppingcartitem` DROP FOREIGN KEY `ShoppingCartItem_productId_fkey`;

-- AlterTable
ALTER TABLE `shoppingcart` ADD COLUMN `subTotal` BIGINT NOT NULL,
    ADD COLUMN `total` BIGINT NOT NULL;

-- AlterTable
ALTER TABLE `shoppingcartitem` DROP COLUMN `productId`;

-- CreateTable
CREATE TABLE `_ProductToShoppingCartItem` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProductToShoppingCartItem_AB_unique`(`A`, `B`),
    INDEX `_ProductToShoppingCartItem_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProductToShoppingCartItem` ADD CONSTRAINT `_ProductToShoppingCartItem_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductToShoppingCartItem` ADD CONSTRAINT `_ProductToShoppingCartItem_B_fkey` FOREIGN KEY (`B`) REFERENCES `ShoppingCartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
