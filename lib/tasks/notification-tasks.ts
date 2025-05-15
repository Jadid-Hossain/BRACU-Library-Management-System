import { db } from '@/database/drizzle';
import { borrowRecords, books, users, fines } from '@/database/schema';
import { NotificationService } from '@/lib/services/notification.service';
import { eq, and, lt, isNull, sql } from 'drizzle-orm';
import { format, parse } from 'date-fns';

/**
 * Sends due date reminders for books due in the next 24 hours
 */
export async function sendDueDateReminders() {
  try {
    console.log('Running task: sendDueDateReminders');
    
    // Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');
    
    // Find all borrowed books due tomorrow
    const records = await db
      .select({
        borrowRecord: borrowRecords,
        user: users,
        book: books,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(
        and(
          eq(borrowRecords.status, 'BORROWED'),
          sql`DATE(${borrowRecords.dueDate}) = ${tomorrowStr}`
        )
      );
    
    console.log(`Found ${records.length} books due tomorrow`);
    
    // Send notifications for each book
    for (const record of records) {
      // Convert string date to Date object
      const dueDate = record.borrowRecord.dueDate 
        ? new Date(record.borrowRecord.dueDate) 
        : tomorrow;
        
      await NotificationService.sendDueDateReminder({
        userId: record.user.id,
        email: record.user.email,
        bookTitle: record.book.title,
        dueDate: dueDate,
      });
    }
    
    console.log('Due date reminders sent successfully');
    return { success: true, count: records.length };
  } catch (error) {
    console.error('Error sending due date reminders:', error);
    return { success: false, error };
  }
}

/**
 * Checks for overdue books and sends notifications
 */
export async function checkOverdueBooks() {
  try {
    console.log('Running task: checkOverdueBooks');
    
    // Calculate today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayStr = format(today, 'yyyy-MM-dd');
    
    // Find all borrowed books that are now overdue
    const records = await db
      .select({
        borrowRecord: borrowRecords,
        user: users,
        book: books,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(
        and(
          eq(borrowRecords.status, 'BORROWED'),
          sql`DATE(${borrowRecords.dueDate}) < ${todayStr}`
        )
      );
    
    console.log(`Found ${records.length} overdue books`);
    
    // Process each overdue book
    for (const record of records) {
      // Check if this record already has a fine
      const existingFine = await db
        .select()
        .from(fines)
        .where(eq(fines.borrowRecordId, record.borrowRecord.id))
        .limit(1);
      
      // If no fine exists, create one and send notification
      if (existingFine.length === 0) {
        // Convert string date to Date object
        const dueDate = record.borrowRecord.dueDate 
          ? new Date(record.borrowRecord.dueDate) 
          : new Date();
          
        const daysOverdue = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const fineAmount = daysOverdue * 10; // BDT 10 per day
        
        // Create fine record
        await db.insert(fines).values({
          userId: record.user.id,
          borrowRecordId: record.borrowRecord.id,
          amount: fineAmount,
          reason: `Book overdue by ${daysOverdue} days`,
          status: 'PENDING',
          issuedBy: 'SYSTEM',
        });
        
        // Send notification
        await NotificationService.sendOverdueNotification({
          userId: record.user.id,
          email: record.user.email,
          bookTitle: record.book.title,
          dueDate: dueDate,
          daysOverdue,
          fineAmount,
        });
      }
    }
    
    console.log('Overdue notifications processed successfully');
    return { success: true, count: records.length };
  } catch (error) {
    console.error('Error processing overdue books:', error);
    return { success: false, error };
  }
} 