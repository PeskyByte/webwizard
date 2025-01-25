/*
  Warnings:

  - You are about to drop the column `city` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `Orders` table. All the data in the column will be lost.
  - Made the column `contctEmail` on table `Orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Orders` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `state`,
    DROP COLUMN `status`,
    DROP COLUMN `zipCode`,
    MODIFY `contctEmail` TEXT NOT NULL;
