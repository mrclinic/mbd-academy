-- AlterTable
ALTER TABLE "PricingPlan" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
