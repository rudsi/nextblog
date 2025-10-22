ALTER TABLE "posts" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT generated always as identity;