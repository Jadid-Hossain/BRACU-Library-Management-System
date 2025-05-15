import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';
import config from '@/lib/config';

// Create neon connection
const sql = neon(config.env.databaseUrl);

// Create drizzle instance
export const db = drizzle({ client: sql, schema }); 