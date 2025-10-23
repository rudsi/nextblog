CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "posts_to_categories" (
	"post_id" uuid NOT NULL,
	"category_id" integer NOT NULL,
	CONSTRAINT "posts_to_categories_post_id_category_id_pk" PRIMARY KEY("post_id","category_id")
);
--> statement-breakpoint
ALTER TABLE "posts_to_categories" ADD CONSTRAINT "posts_to_categories_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_to_categories" ADD CONSTRAINT "posts_to_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;