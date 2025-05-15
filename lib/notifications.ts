import { resend } from '@/lib/resend';

export async function sendAvailabilityNotification(userId: number, bookTitle: string) {
    const user = await db.query.users.findFirst({ where: { id: userId } });

    await resend.emails.send({
        from: 'library@bracu.edu',
        to: user.email,
        subject: 'Reserved Book Now Available!',
        html: `<p>Dear ${user.name},</p>
           <p>The book <strong>${bookTitle}</strong> is now available for pickup.</p>
           <p>Please collect it within 2 days, or the hold will be cancelled.</p>`,
    });
}
