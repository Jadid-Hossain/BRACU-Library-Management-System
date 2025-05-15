-- Enum for reservation status
CREATE TYPE "reservation_status" AS ENUM ('WAITING', 'READY', 'BORROWED', 'EXPIRED', 'CANCELLED');

-- Create reservations table
CREATE TABLE IF NOT EXISTS "reservations" (
    "id" uuid PRIMARY KEY NOT NULL,
    "user_id" uuid NOT NULL REFERENCES "users"("id"),
    "book_id" uuid NOT NULL REFERENCES "books"("id"),
    "reservation_date" timestamp with time zone DEFAULT now() NOT NULL,
    "expiry_date" timestamp with time zone,
    "status" "reservation_status" DEFAULT 'WAITING' NOT NULL,
    "position" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS "reservations_book_id_idx" ON "reservations" ("book_id");
CREATE INDEX IF NOT EXISTS "reservations_user_id_idx" ON "reservations" ("user_id");
CREATE INDEX IF NOT EXISTS "reservations_status_idx" ON "reservations" ("status"); 