CREATE TYPE "public"."fine_status" AS ENUM('PENDING', 'PAID', 'WAIVED');--> statement-breakpoint
CREATE TABLE "books" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"genre" text NOT NULL,
	"rating" integer NOT NULL,
	"cover_url" text NOT NULL,
	"cover_color" varchar(7) NOT NULL,
	"description" text NOT NULL,
	"total_copies" integer DEFAULT 1 NOT NULL,
	"available_copies" integer DEFAULT 0 NOT NULL,
	"video_url" text NOT NULL,
	"summary" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "books_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "borrow_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"book_id" uuid NOT NULL,
	"borrow_date" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" date NOT NULL,
	"return_date" date,
	"status" "borrow_status" DEFAULT 'BORROWED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "borrow_records_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "fines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"borrow_record_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"reason" text NOT NULL,
	"status" "fine_status" DEFAULT 'PENDING' NOT NULL,
	"issued_by" text DEFAULT 'SYSTEM' NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	CONSTRAINT "fines_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fines" ADD CONSTRAINT "fines_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fines" ADD CONSTRAINT "fines_borrow_record_id_borrow_records_id_fk" FOREIGN KEY ("borrow_record_id") REFERENCES "public"."borrow_records"("id") ON DELETE no action ON UPDATE no action;