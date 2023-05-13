-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'creator', 'customer', 'shiper', 'guest') NOT NULL DEFAULT 'customer';
