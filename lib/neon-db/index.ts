import { neon } from '@neondatabase/serverless';

// Use a default value for development or check if DATABASE_URL is set
const dbUrl = process.env.DATABASE_URL || 'postgres://placeholder:placeholder@placeholder.db/placeholder';
const sql = neon(dbUrl);

export default sql;