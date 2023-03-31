-- DropForeignKey
ALTER TABLE `shoppingcartitem` DROP FOREIGN KEY `ShoppingCartItem_ShoppingCartId_fkey`;

-- AddForeignKey
ALTER TABLE `ShoppingCartItem` ADD CONSTRAINT `ShoppingCartItem_ShoppingCartId_fkey` FOREIGN KEY (`ShoppingCartId`) REFERENCES `ShoppingCart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
