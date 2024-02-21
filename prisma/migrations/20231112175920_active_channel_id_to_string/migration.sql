-- DropForeignKey
ALTER TABLE "ChannelConfig" DROP CONSTRAINT "ChannelConfig_activeChannelId_fkey";

-- AlterTable
ALTER TABLE "ActiveChannel" ALTER COLUMN "id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ChannelConfig" ALTER COLUMN "activeChannelId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "ChannelConfig" ADD CONSTRAINT "ChannelConfig_activeChannelId_fkey" FOREIGN KEY ("activeChannelId") REFERENCES "ActiveChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
