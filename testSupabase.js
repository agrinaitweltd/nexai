// testSupabase.js
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // make sure it points to your .env

import { createClient } from '@supabase/supabase-js';

// Debug: check if variables are loaded
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY?.slice(0, 8) + '...');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const tables = [
  'exports',
  'farmers',
  'livestock',
  'profiles'
];   // replace with your actual table names

async function testAllTables() {
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) console.log(`❌ Table: ${table} | Error:`, error.message);
    else console.log(`✅ Table: ${table} | Rows returned: ${data.length}`);
  }
}

testAllTables();