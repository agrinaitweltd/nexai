import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vlxfwcdnsdqgcqkdnpav.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZseGZ3Y2Ruc2RxZ2Nxa2RucGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDMwNDAsImV4cCI6MjA5MDM3OTA0MH0.qXkeZADwGdSSbdvLnHkntLfvmiTfVp1lpVBi0sezj3s'

export const supabase = createClient(supabaseUrl, supabaseKey)
