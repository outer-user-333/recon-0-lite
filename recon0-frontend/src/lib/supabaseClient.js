import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace with your actual Supabase URL and Anon Key
// It is safe to expose these in a browser-based application
const supabaseUrl = 'https://lxcbdbirburbdbluaayq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4Y2JkYmlyYnVyYmRibHVhYXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjc3NjEsImV4cCI6MjA3MTkwMzc2MX0.E_0dY139yTzGjjh2WUtby1iTG2tJdMVqSFg-s1uSilk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)