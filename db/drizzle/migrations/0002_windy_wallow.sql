CREATE TABLE "mongo_queries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(150) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"question" text NOT NULL,
	"task" text NOT NULL,
	"difficulty" "question_difficulty" DEFAULT 'easy' NOT NULL,
	"starter_query" text,
	"solution_query" text,
	"explanation" text,
	"hints" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"expected_output" jsonb,
	"dataset_version" varchar(50),
	"status" "question_status" DEFAULT 'draft' NOT NULL,
	"points" integer DEFAULT 10 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"chapter" varchar(150) NOT NULL,
	"lesson_number" integer NOT NULL,
	"collection_context" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "progress" CASCADE;--> statement-breakpoint
CREATE UNIQUE INDEX "mongo_queries_slug_idx" ON "mongo_queries" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "mongo_queries_lesson_number_idx" ON "mongo_queries" USING btree ("lesson_number");--> statement-breakpoint
CREATE INDEX "mongo_queries_chapter_idx" ON "mongo_queries" USING btree ("chapter");--> statement-breakpoint
CREATE INDEX "mongo_queries_status_idx" ON "mongo_queries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "mongo_queries_difficulty_idx" ON "mongo_queries" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "mongo_queries_sort_order_idx" ON "mongo_queries" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "mongo_queries_lesson_chapter_idx" ON "mongo_queries" USING btree ("lesson_number","chapter","sort_order");