import { createClient } from "@supabase/supabase-js";

// variables
// const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It is safe to expose these in a browser-based application
const supabaseUrl = "https://dhhfkffmblccqmqikevu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoaGZrZmZtYmxjY3FtcWlrZXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNTc4OTMsImV4cCI6MjA3MjczMzg5M30.O_o1bd8GH2F9MTn1ouXGqCmJSNon_x0hkNSJtIc1DUA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
