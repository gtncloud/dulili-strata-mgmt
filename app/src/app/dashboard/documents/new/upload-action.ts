"use server";

import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side uploads (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function uploadFileServer(
  base64Data: string,
  fileName: string,
  filePath: string,
  contentType: string
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return { error: 'Supabase configuration missing' };
    }

    // Create admin client with service role key (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload file
    const { data, error } = await supabaseAdmin.storage
      .from('documents')
      .upload(filePath, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Server upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('documents')
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Server upload error:', error);
    return { error: 'Failed to upload file' };
  }
}
