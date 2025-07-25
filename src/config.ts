// src/config.ts

// supabase
export const VITE_SUPABASE_URL: string = import.meta.env.VITE_SUPABASE_URL;
export const VITE_SUPABASE_ANON_KEY: string = import.meta.env
  .VITE_SUPABASE_ANON_KEY;

// Simple validation - just ensure keys exist
if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  throw new Error("Missing required environment variables");
}
