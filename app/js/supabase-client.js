// app/js/supabase-client.js

const SUPABASE_URL = "https://vjbvjzmxbeoyflhrwrpy.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqYnZqem14YmVveWZsaHJ3cnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MzAzMjcsImV4cCI6MjEwMDQwNjMyN30.XC7m4KXLqdif6AeoskiAckjvTpKCZIiI3Nza_FoY0qY";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);