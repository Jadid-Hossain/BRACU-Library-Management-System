# BRAC University Library Management System

## Facility Booking System Setup

### Database Setup Instructions

The system uses Neon PostgreSQL for database storage. Follow these steps to set up your database:

1. **Create a Neon PostgreSQL database**:
   - Sign up at [https://neon.tech](https://neon.tech)
   - Create a new project
   - Note your connection string

2. **Configure environment variables**:
   - Copy `env.example` to `.env.local`
   - Replace the `DATABASE_URL` with your Neon connection string

3. **Set up database tables**:
   - Connect to your Neon database using the Neon SQL Editor or any PostgreSQL client
   - Run the SQL commands in `db-schema.sql` to create the required tables

### Running the Application

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Facility Booking Flow

1. **Main Booking Page** (`/facility-booking`):
   - Users select date, facility type, room, and time slots
   - System checks if slots are already booked
   - Generates a unique reservation code

2. **User Information Page** (`/facility-booking/user-info`):
   - Collects user details (or group member details)
   - Group bookings require at least 3 members

3. **Confirmation Page** (`/facility-booking/confirmation`):
   - Displays booking details and reservation code
   - Links back to homepage

### Database Schema

The system uses two main tables:

1. **bookings**: Stores facility reservation details
   - reservation_code (unique identifier)
   - date, facility_type, room
   - email and selected time slots

2. **user_info**: Stores details about users
   - Links to bookings via reservation_code
   - Stores user ID, name, department, contact info

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

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

## Library Management Features
This branch adds library management features:

1. Facility booking system
2. Contact pages
3. Library information pages
4. Research help pages
5. Similarity checking pages
6. Membership management

### Voiceflow Integration
To integrate the Voiceflow chatbot, add the script from oiceflow-script.html to the layout component.

### Dependencies
Install additional dependencies:
`ash
npm install @neondatabase/serverless pg react-datepicker react-select
`

