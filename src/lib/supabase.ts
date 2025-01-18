import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://xiuwvwhsytgsvlxnknsi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpdXd2d2hzeXRnc3ZseG5rbnNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjQ4MTA0MywiZXhwIjoyMDQ4MDU3MDQzfQ.l8gkQbODAiCWmj_d-FUzkFoTYBmHGQd7NUfufT_zsyk'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
