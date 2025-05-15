import { neon } from '@neondatabase/serverless';

// Simple mock SQL function for development
const mockSql = (strings: TemplateStringsArray, ...values: any[]) => {
  const query = strings.join('?').toLowerCase();
  console.log('Mock SQL query:', query.substring(0, 100));
  
  // Return ID for inserts
  if (query.includes('insert into')) {
    console.log('Mock DB: Insert successful (simulated)');
    return Promise.resolve([{ id: Date.now() }]);
  }
  
  // Return true for table checks
  if (query.includes('select exists')) {
    return Promise.resolve([{ exists: true }]);
  }
  
  // Empty success for create table
  if (query.includes('create table')) {
    return Promise.resolve([]);
  }
  
  // Test query
  if (query.includes('select 1')) {
    return Promise.resolve([{ test: 1 }]);
  }
  
  // Default response
  return Promise.resolve([]);
};

// Use mock in development, real DB in production
const sql = process.env.NODE_ENV !== 'production' 
  ? mockSql
  : process.env.DATABASE_URL
    ? neon(process.env.DATABASE_URL)
    : (() => { throw new Error('DATABASE_URL required in production'); })();

// Simple connection test
export const testConnection = async () => {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful (may be mock)');
    return { success: true };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { success: false, error };
  }
};

export default sql;