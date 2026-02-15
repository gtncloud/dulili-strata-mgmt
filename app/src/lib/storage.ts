/**
 * Supabase Storage Helper
 * 
 * This module provides utilities for file upload and management using Supabase Storage.
 * 
 * Setup Instructions:
 * 1. Create a storage bucket in Supabase dashboard: "documents"
 * 2. Set bucket to public or private based on requirements
 * 3. Configure RLS policies for access control
 * 4. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a function to get Supabase client (will be used with auth token)
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient();

const BUCKET_NAME = 'documents';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  path: string,
  options?: {
    onProgress?: (progress: number) => void;
  }
): Promise<{ url: string; path: string } | { error: string }> {
  if (!supabase) {
    return { error: 'Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.' };
  }

  try {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { error: 'File size exceeds 10MB limit' };
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (!allowedTypes.includes(file.type)) {
      return { error: 'File type not allowed. Supported: PDF, Images, Word, Excel' };
    }

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload file' };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete file' };
  }
}

/**
 * Get a signed URL for private files (valid for 1 hour)
 */
export async function getSignedUrl(path: string): Promise<{ url: string } | { error: string }> {
  if (!supabase) {
    return { error: 'Supabase client not initialized' };
  }

  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, 3600); // 1 hour

    if (error) {
      console.error('Signed URL error:', error);
      return { error: error.message };
    }

    return { url: data.signedUrl };
  } catch (error) {
    console.error('Signed URL error:', error);
    return { error: 'Failed to generate signed URL' };
  }
}

/**
 * Generate a unique file path
 */
export function generateFilePath(
  buildingId: string,
  category: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${buildingId}/${category}/${timestamp}_${sanitizedFileName}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Get file extension
 */
export function getFileExtension(fileName: string): string {
  return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2);
}

/**
 * Get file icon based on type
 */
export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('image')) return '🖼️';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
  return '📎';
}
