import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton pattern - create only one client instance
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (supabaseClient) {
    console.log('🔄 Reusing existing Supabase client');
    return supabaseClient;
  }
  
  console.log('🆕 Creating new Supabase client');
  supabaseClient = createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );
  
  return supabaseClient;
};
