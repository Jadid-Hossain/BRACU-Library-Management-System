// In-memory store for development mode
const mockDb: Record<string, any[]> = {
  contact_messages: [],
  similarity_submissions: [],
  research_help_submissions: [],
  file_uploads: [],
  facility_booking: []
};

// Mock DB counter for IDs
let mockIdCounter = 1;

// Create a mock SQL function for development when no database is available
const createMockSql = () => {
  console.log('🔶 Using mock database for development');
  
  return (strings: TemplateStringsArray, ...values: any[]) => {
    const rawQuery = strings.join('?');
    const query = rawQuery.toLowerCase();
    
    // Handle different query types with simple regex matching
    if (query.includes('select exists') && query.includes('information_schema.tables')) {
      // Table existence check - always return true
      return Promise.resolve([{ exists: true }]);
    }
    
    if (query.includes('create table')) {
      // Table creation - do nothing but succeed
      console.log('🔶 Mock DB: Created table (mock)');
      return Promise.resolve([]);
    }
    
    if (query.includes('insert into')) {
      // Handle inserts
      const id = mockIdCounter++;
      const returnObj = { id };
      
      // Extract table name
      const tableMatch = query.match(/insert into ([a-z_]+)/i);
      const tableName = tableMatch ? tableMatch[1] : 'unknown_table';
      
      // Add to our mock DB
      if (mockDb[tableName]) {
        const newRecord = { 
          id, 
          ...values.reduce((obj, val, idx) => ({ ...obj, [`field${idx}`]: val }), {}),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockDb[tableName].push(newRecord);
      } else {
        mockDb[tableName] = [{ 
          id, 
          ...values.reduce((obj, val, idx) => ({ ...obj, [`field${idx}`]: val }), {}),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }];
      }
      
      console.log(`🔶 Mock DB: Inserted into ${tableName}, ID: ${id}`);
      return Promise.resolve([returnObj]);
    }
    
    if (query.includes('select')) {
      // Basic select queries
      return Promise.resolve([]);
    }
    
    // For testing
    if (query.includes('select 1')) {
      return Promise.resolve([{ test: 1 }]);
    }
    
    console.log(`🔶 Mock DB: Unhandled query type: ${rawQuery.substring(0, 100)}...`);
    return Promise.resolve([]);
  };
};

export default createMockSql; 