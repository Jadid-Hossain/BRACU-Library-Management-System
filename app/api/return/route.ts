// After updating book availability
const reservation = await db.query.reservations.findFirst({
    where: {
        book_id: bookId,
        status: 'pending',
    },
    orderBy: { created_at: 'asc' },
});

if (reservation) {
    // Send notification
    await sendAvailabilityNotification(reservation.user_id, book.title);

    // Update reservation status
    await db.update(reservations)
        .set({ status: 'notified' })
        .where({ id: reservation.id });
}
