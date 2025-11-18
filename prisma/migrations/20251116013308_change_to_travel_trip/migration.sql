/*
  Warnings:

  - You are about to drop the column `distanceKm` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `driverName` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `dropoffLocation` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `fare` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLocation` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `riderName` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `tripDateTime` on the `Trip` table. All the data in the column will be lost.
  - Added the required column `destinationCity` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationCountry` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageType` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "distanceKm",
DROP COLUMN "driverName",
DROP COLUMN "dropoffLocation",
DROP COLUMN "fare",
DROP COLUMN "pickupLocation",
DROP COLUMN "riderName",
DROP COLUMN "tripDateTime",
ADD COLUMN     "destinationCity" TEXT NOT NULL,
ADD COLUMN     "destinationCountry" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "flightNumber" TEXT,
ADD COLUMN     "hotelName" TEXT,
ADD COLUMN     "packageType" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "travelerName" TEXT;
