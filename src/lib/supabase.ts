import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Access environment variables directly in React Native with Expo
const supabaseUrl = 'https://cwwkyezkcqytheyyaywa.supabase.co';

const supabaseAnonKey = 'sb_publishable_sU7TLKV0C04t0g1syzGHZQ_d60KUIX-';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
