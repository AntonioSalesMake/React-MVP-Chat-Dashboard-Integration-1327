import { createClient } from '@supabase/supabase-js'

// Your Supabase project credentials
const SUPABASE_URL = 'https://kwacnacwkuiysbyklqgi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3YWNuYWN3a3VpeXNieWtscWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTY3MzcsImV4cCI6MjA2NjYzMjczN30.zx1xEkzWTitP8IFHXQ7j8O9N3GxvsMb5Qt-_IR0T9SU'

// Verify credentials are configured
if (SUPABASE_URL === 'https://your-project-id.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key-here') {
  throw new Error('Missing Supabase variables');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase;