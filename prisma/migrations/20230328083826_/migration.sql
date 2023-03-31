/*
  Warnings:

  - You are about to drop the `_producttoshoppingcartitem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `ShoppingCartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_producttoshoppingcartitem` DROP FOREIGN KEY `_ProductToShoppingCartItem_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttoshoppingcartitem` DROP FOREIGN KEY `_ProductToShoppingCartItem_B_fkey`;

-- AlterTable
ALTER TABLE `shoppingcartitem` ADD COLUMN `productId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_producttoshoppingcartitem`;

-- AddForeignKey
ALTER TABLE `ShoppingCartItem` ADD CONSTRAINT `ShoppingCartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
