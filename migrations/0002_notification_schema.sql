DO $$ 
BEGIN
    -- Create notification_type enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE "notification_type" AS ENUM ('DUE_DATE_REMINDER', 'OVERDUE_NOTIFICATION', 'APPROVAL_NOTIFICATION', 'BOOK_AVAILABILITY', 'RESERVATION_AVAILABLE');
    END IF;
END $$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
    "type" "notification_type" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "metadata" TEXT,
    "expires_at" TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS "notifications_user_id_idx" ON "notifications" ("user_id");
CREATE INDEX IF NOT EXISTS "notifications_is_read_idx" ON "notifications" ("is_read");
CREATE INDEX IF NOT EXISTS "notifications_created_at_idx" ON "notifications" ("created_at" DESC);

-- Add a comment
COMMENT ON TABLE "notifications" IS 'Stores user notifications for the BRACU Library System'; 