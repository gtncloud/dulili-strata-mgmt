import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lixvbifljzxmxkjaapft.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Y_bnn21YhsRzHab4_tGpKw_vi4DshuCc';

console.log('🧪 Testing Supabase Storage Configuration...\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Has Anon Key:', !!supabaseKey);
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  try {
    // Test 1: List buckets
    console.log('📋 Test 1: Listing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
    } else {
      console.log('✅ Buckets found:', buckets?.length || 0);
      buckets?.forEach(bucket => {
        console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
      
      const documentsBucket = buckets?.find(b => b.name === 'documents');
      if (documentsBucket) {
        console.log('✅ "documents" bucket exists!');
      } else {
        console.log('⚠️  "documents" bucket NOT found - you need to create it');
        console.log('   See SUPABASE-STORAGE-SETUP.md for instructions');
      }
    }
    console.log('');

    // Test 2: Try to upload a test file
    console.log('📤 Test 2: Testing file upload...');
    const testContent = `Test file created at ${new Date().toISOString()}`;
    const blob = new Blob([testContent], { type: 'text/plain' });
    const fileName = `test/${Date.now()}-test.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, blob);

    if (uploadError) {
      console.error('❌ Upload failed:', uploadError.message);
      if (uploadError.message.includes('Bucket not found')) {
        console.log('   → You need to create the "documents" bucket first');
      } else if (uploadError.message.includes('not allowed')) {
        console.log('   → You need to set up RLS policies');
      }
    } else {
      console.log('✅ Upload successful!');
      console.log('   File path:', uploadData.path);
      
      // Test 3: Get public URL
      console.log('');
      console.log('🔗 Test 3: Getting file URL...');
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path);
      
      console.log('✅ File URL:', urlData.publicUrl);
      
      // Test 4: Delete test file
      console.log('');
      console.log('🗑️  Test 4: Cleaning up test file...');
      const { error: deleteError } = await supabase.storage
        .from('documents')
        .remove([uploadData.path]);
      
      if (deleteError) {
        console.error('❌ Delete failed:', deleteError.message);
      } else {
        console.log('✅ Test file deleted successfully');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('');
  console.log('🎯 Summary:');
  console.log('   If all tests passed, your storage is ready!');
  console.log('   If tests failed, check SUPABASE-STORAGE-SETUP.md for setup instructions');
}

testStorage();
