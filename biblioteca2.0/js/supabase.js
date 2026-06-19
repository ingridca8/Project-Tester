const SUPABASE_URL = 'https://oyxbycmpkfcszweufzqd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eGJ5Y21wa2Zjc3p3ZXVmenFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTkyMDYsImV4cCI6MjA5NTk5NTIwNn0.mKWFCngzTVtlUkJPAoOX38fLeFqeLakvkdV2B4RVJpQ';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
