import { Resend } from 'resend';
import { db } from '@/database/drizzle';
import { notifications } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const resend = new Resend(process.env.RESEND_API_KEY);

export class NotificationService {
  static async createNotification({
    userId,
    type,
    title,
    message,
    metadata,
    expiresAt
  }: {
    userId: string;
    type: 'DUE_DATE_REMINDER' | 'OVERDUE_NOTIFICATION' | 'APPROVAL_NOTIFICATION' | 'BOOK_AVAILABILITY' | 'RESERVATION_AVAILABLE';
    title: string;
    message: string;
    metadata?: any;
    expiresAt?: Date;
  }) {
    return await db.insert(notifications).values({
      userId,
      type,
      title,
      message,
      metadata: metadata ? JSON.stringify(metadata) : null,
      expiresAt
    });
  }

  static async sendEmailNotification({
    email,
    subject,
    content
  }: {
    email: string;
    subject: string;
    content: string;
  }) {
    try {
      await resend.emails.send({
        from: 'BRACU Library <library@bracu.edu.bd>',
        to: email,
        subject,
        html: content,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  static async markAsRead(notificationId: string) {
    return await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));
  }

  static async getUserNotifications(userId: string) {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(notifications.createdAt);
  }

  // Specific notification methods
  static async sendDueDateReminder({
    userId,
    email,
    bookTitle,
    dueDate
  }: {
    userId: string;
    email: string;
    bookTitle: string;
    dueDate: Date;
  }) {
    const title = 'Book Due Date Reminder';
    const message = `Your book "${bookTitle}" is due on ${dueDate.toLocaleDateString()}`;
    
    await this.createNotification({
      userId,
      type: 'DUE_DATE_REMINDER',
      title,
      message,
      metadata: { bookTitle, dueDate },
    });

    await this.sendEmailNotification({
      email,
      subject: title,
      content: `
        <h2>Book Due Date Reminder</h2>
        <p>Dear user,</p>
        <p>${message}</p>
        <p>Please ensure to return the book on time to avoid any late fees.</p>
        <p>Best regards,<br>BRACU Library</p>
      `,
    });
  }

  static async sendOverdueNotification({
    userId,
    email,
    bookTitle,
    dueDate,
    daysOverdue,
    fineAmount
  }: {
    userId: string;
    email: string;
    bookTitle: string;
    dueDate: Date;
    daysOverdue: number;
    fineAmount: number;
  }) {
    const title = 'Overdue Book Notice';
    const message = `Your book "${bookTitle}" is overdue by ${daysOverdue} days. A fine of BDT ${fineAmount} has been applied.`;
    
    await this.createNotification({
      userId,
      type: 'OVERDUE_NOTIFICATION',
      title,
      message,
      metadata: { bookTitle, dueDate, daysOverdue, fineAmount },
    });

    await this.sendEmailNotification({
      email,
      subject: title,
      content: `
        <h2>Overdue Book Notice</h2>
        <p>Dear user,</p>
        <p>${message}</p>
        <p>The book was due on ${dueDate.toLocaleDateString()}.</p>
        <p>Please return the book as soon as possible to avoid additional charges.</p>
        <p>Best regards,<br>BRACU Library</p>
      `,
    });
  }

  static async sendApprovalNotification({
    userId,
    email,
    status,
    message
  }: {
    userId: string;
    email: string;
    status: 'APPROVED' | 'REJECTED';
    message?: string;
  }) {
    const title = `Account ${status}`;
    const notificationMessage = status === 'APPROVED' 
      ? 'Your account has been approved. Welcome to BRACU Library!' 
      : `Your account has been rejected. Reason: ${message || 'Not specified'}`;
    
    await this.createNotification({
      userId,
      type: 'APPROVAL_NOTIFICATION',
      title,
      message: notificationMessage,
      metadata: { status, message },
    });

    await this.sendEmailNotification({
      email,
      subject: title,
      content: `
        <h2>Account ${status}</h2>
        <p>Dear user,</p>
        <p>${notificationMessage}</p>
        ${status === 'APPROVED' 
          ? '<p>You can now access all the library services.</p>' 
          : '<p>Please contact the library administration for more information.</p>'
        }
        <p>Best regards,<br>BRACU Library</p>
      `,
    });
  }

  static async sendBookAvailabilityNotification({
    userId,
    email,
    bookTitle
  }: {
    userId: string;
    email: string;
    bookTitle: string;
  }) {
    const title = 'Book Available for Reservation';
    const message = `The book "${bookTitle}" is now available!`;

    await this.createNotification({
      userId,
      type: 'BOOK_AVAILABILITY',
      title,
      message,
      metadata: { bookTitle },
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days expiry
    });

    await this.sendEmailNotification({
      email,
      subject: title,
      content: `
        <h2>Book Available Notification</h2>
        <p>Dear user,</p>
        <p>${message}</p>
        <p>You can now proceed to borrow or reserve the book.</p>
        <p>Please note that this notification will expire in 2 days.</p>
        <p>Best regards,<br>BRACU Library</p>
      `,
    });
  }

  static async sendReservationAvailableNotification({
    userId,
    email,
    bookTitle
  }: {
    userId: string;
    email: string;
    bookTitle: string;
  }) {
    const title = 'Reserved Book Available';
    const message = `Your reserved book "${bookTitle}" is now available for pickup! Please collect it within 2 days.`;

    await this.createNotification({
      userId,
      type: 'RESERVATION_AVAILABLE',
      title,
      message,
      metadata: { bookTitle },
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days expiry
    });

    await this.sendEmailNotification({
      email,
      subject: title,
      content: `
        <h2>Reserved Book Available</h2>
        <p>Dear user,</p>
        <p>${message}</p>
        <p>Please visit the library to collect your book.</p>
        <p>If not collected within 2 days, your reservation will be cancelled and the book will be made available to others.</p>
        <p>Best regards,<br>BRACU Library</p>
      `,
    });
  }
} 