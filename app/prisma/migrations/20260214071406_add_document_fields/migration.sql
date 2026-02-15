-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "fileName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "mimeType" TEXT NOT NULL DEFAULT 'application/octet-stream';
