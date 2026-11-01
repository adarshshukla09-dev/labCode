CREATE TYPE "public"."progress_status" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."question_dialect" AS ENUM('sqlite', 'postgresql', 'mysql', 'mongodb');--> statement-breakpoint
CREATE TYPE "public"."question_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"hints_used" integer DEFAULT 0 NOT NULL,
	"best_score" integer DEFAULT 0 NOT NULL,
	"last_submitted_query" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(150) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"question" text NOT NULL,
	"task" text NOT NULL,
	"dialect" "question_dialect" DEFAULT 'sqlite' NOT NULL,
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
	"table_context" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "progress_user_question_idx" ON "progress" USING btree ("user_id","question_id");--> statement-breakpoint
CREATE INDEX "progress_user_idx" ON "progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "progress_question_idx" ON "progress" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "progress_status_idx" ON "progress" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_slug_idx" ON "questions" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_lesson_number_idx" ON "questions" USING btree ("lesson_number");--> statement-breakpoint
CREATE INDEX "questions_chapter_idx" ON "questions" USING btree ("chapter");--> statement-breakpoint
CREATE INDEX "questions_status_idx" ON "questions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "questions_dialect_idx" ON "questions" USING btree ("dialect");--> statement-breakpoint
CREATE INDEX "questions_difficulty_idx" ON "questions" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "questions_sort_order_idx" ON "questions" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "questions_lesson_chapter_idx" ON "questions" USING btree ("lesson_number","chapter","sort_order");