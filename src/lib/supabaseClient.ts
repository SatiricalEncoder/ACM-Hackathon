import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://jzyxgvcogfarmfzwmgwc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6eXhndmNvZ2Zhcm1mendtZ3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MDcyMTAsImV4cCI6MjA3NTM4MzIxMH0.Kd7YHB96W-2h92v_H0_S9FwxAWGZOjW0m-mDujCCiXs",
);
