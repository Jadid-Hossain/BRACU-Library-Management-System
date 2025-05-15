CREATE TYPE "public"."hold_status" AS ENUM('ACTIVE', 'EXPIRED');--> statement-breakpoint
ALTER TYPE "public"."role" ADD VALUE 'FACULTY' BEFORE 'ADMIN';--> statement-breakpoint
CREATE TABLE "holds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"hold_date" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" "hold_status" DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "holds_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "holds" ADD CONSTRAINT "holds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holds" ADD CONSTRAINT "holds_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;