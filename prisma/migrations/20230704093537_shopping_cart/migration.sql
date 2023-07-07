-- DropForeignKey
ALTER TABLE `_categorytoproduct` DROP FOREIGN KEY `_CategoryToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categorytoproduct` DROP FOREIGN KEY `_CategoryToProduct_B_fkey`;

-- DropForeignKey
ALTER TABLE `_mediagallerytoproduct` DROP FOREIGN KEY `_MediaGalleryToProduct_A_fkey`;

-- DropForeignKey
ALTER TABLE `_mediagallerytoproduct` DROP FOREIGN KEY `_MediaGalleryToProduct_B_fkey`;

-- DropForeignKey
ALTER TABLE `_producttoroom` DROP FOREIGN KEY `_ProductToRoom_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttoroom` DROP FOREIGN KEY `_ProductToRoom_B_fkey`;

-- DropForeignKey
ALTER TABLE `_producttowishlist` DROP FOREIGN KEY `_ProductToWishlist_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttowishlist` DROP FOREIGN KEY `_ProductToWishlist_B_fkey`;

-- DropForeignKey
ALTER TABLE `_reviewlikes` DROP FOREIGN KEY `_reviewLikes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_reviewlikes` DROP FOREIGN KEY `_reviewLikes_B_fkey`;

-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `orderitem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `product_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `productreview` DROP FOREIGN KEY `productreview_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `productreview` DROP FOREIGN KEY `productreview_productId_fkey`;

-- DropForeignKey
ALTER TABLE `session` DROP FOREIGN KEY `session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `shoppingcart` DROP FOREIGN KEY `shoppingcart_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `shoppingcartitem` DROP FOREIGN KEY `shoppingcartitem_ShoppingCartId_fkey`;

-- DropForeignKey
ALTER TABLE `shoppingcartitem` DROP FOREIGN KEY `shoppingcartitem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `wishlist` DROP FOREIGN KEY `wishlist_ownerId_fkey`;

-- CreateIndex
CREATE INDEX `orderitem_productId_idx` ON `orderitem`(`productId`);

-- CreateIndex
CREATE INDEX `productreview_ownerId_idx` ON `productreview`(`ownerId`);

-- CreateIndex
CREATE INDEX `shoppingcart_ownerId_idx` ON `shoppingcart`(`ownerId`);

-- CreateIndex
CREATE INDEX `wishlist_ownerId_idx` ON `wishlist`(`ownerId`);

-- RenameIndex
ALTER TABLE `account` RENAME INDEX `account_userId_fkey` TO `account_userId_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `order_ownerId_fkey` TO `order_ownerId_idx`;

-- RenameIndex
ALTER TABLE `orderitem` RENAME INDEX `orderitem_orderId_fkey` TO `orderitem_orderId_idx`;

-- RenameIndex
ALTER TABLE `product` RENAME INDEX `product_creatorId_fkey` TO `product_creatorId_idx`;

-- RenameIndex
ALTER TABLE `productreview` RENAME INDEX `productreview_productId_fkey` TO `productreview_productId_idx`;

-- RenameIndex
ALTER TABLE `session` RENAME INDEX `session_userId_fkey` TO `session_userId_idx`;

-- RenameIndex
ALTER TABLE `shoppingcartitem` RENAME INDEX `shoppingcartitem_ShoppingCartId_fkey` TO `shoppingcartitem_ShoppingCartId_idx`;

-- RenameIndex
ALTER TABLE `shoppingcartitem` RENAME INDEX `shoppingcartitem_productId_fkey` TO `shoppingcartitem_productId_idx`;
