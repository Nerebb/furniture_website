/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `shoppingcart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `shoppingcart_ownerId_key` ON `shoppingcart`(`ownerId`);
