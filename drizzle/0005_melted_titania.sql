ALTER TABLE "posts" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT nextval('posts_id_seq'::regclass);