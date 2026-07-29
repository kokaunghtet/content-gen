-- RenameColumns: tone -> emotion
ALTER TABLE "ContentGeneration" RENAME COLUMN "tone" TO "emotion";

-- AlterColumn: add audienceAge with default for existing rows
ALTER TABLE "ContentGeneration" ADD COLUMN "audienceAge" TEXT NOT NULL DEFAULT 'millennial';
