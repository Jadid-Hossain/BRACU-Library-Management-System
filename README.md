# BRACU Library Management System

A comprehensive library management system that allows users to browse, borrow, reserve, and return books.

## Features

- User authentication and profile management
- Book browsing and searching
- Book borrowing and returning
- Reservation system for unavailable books
- Fine management system
- Admin controls for approving users and managing books

## Reservation System

The system allows users to reserve books when all copies are already borrowed:

1. When a book's available copies reach 0, users will see a "Reserve" button
2. Clicking Reserve adds the user to a queue for that book
3. When someone returns a copy, the first person in the queue gets notified and has 2 days to borrow it
4. If they don't borrow within 2 days, the reservation expires and the next person in queue gets a chance
5. Users can see their position in queue and reservation status
6. Users can manage all their reservations from their profile page

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   DATABASE_URL=your-neon-db-url
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret
   MIGRATIONS_SECRET=your-migrations-secret
   CRON_SECRET_KEY=your-cron-secret
   ```
4. Run the database migrations:
   ```bash
   curl -X GET http://localhost:3000/api/migrations \
     -H "Authorization: Bearer your-migrations-secret"
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## CRON Jobs

The system uses CRON jobs to handle expired reservations:

1. Set up a recurring job to hit the API endpoint every few minutes:
   ```
   curl -X GET https://your-domain.com/api/cron/process-reservations \
     -H "Authorization: Bearer your-cron-secret-key"
   ```
2. This can be done using Vercel Cron Jobs or external services like GitHub Actions, Upstash, etc.

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS
- Database: PostgreSQL (via Neon)
- ORM: Drizzle
- Authentication: NextAuth.js

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
