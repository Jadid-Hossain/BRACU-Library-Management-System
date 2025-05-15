import { pgTable, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { users } from '@/database/schema';

export const notificationTypeEnum = pgEnum('notification_type', [
  'DUE_DATE_REMINDER',
  'OVERDUE_NOTIFICATION',
  'APPROVAL_NOTIFICATION',
  'BOOK_AVAILABILITY',
  'RESERVATION_AVAILABLE'
]);

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  metadata: text('metadata'), // JSON string for additional data
  expiresAt: timestamp('expires_at'),
}); 

// Define books table
export const books = pgTable('books', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    price: text('price'),
    isForSale: boolean('is_for_sale').default(false),
    copiesAvailable: text('copies_available').notNull(),
    totalSold: text('total_sold').default('0'),
    // ... other book fields
  });