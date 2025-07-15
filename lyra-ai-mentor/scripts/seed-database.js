#!/usr/bin/env node

/**
 * Database Seeder Script
 * Ensures all required toolkit data exists in Supabase
 * 
 * Usage: npm run db:seed
 */

import { createClient } from '@supabase/supabase-js';
import { ensureToolkitData, verifyToolkitData } from '../src/utils/ensureToolkitData.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://hfkzwjnlxrwynactcmpe.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seed process...\n');

  try {
    // First verify what's missing
    console.log('📊 Checking existing data...');
    const verification = await verifyToolkitData(supabase);
    
    if (verification.isValid) {
      console.log('✅ All required data already exists!');
      return;
    }

    console.log('\n🔍 Missing data detected:');
    if (verification.missingCategories.length > 0) {
      console.log(`   - Categories: ${verification.missingCategories.join(', ')}`);
    }
    if (verification.missingAchievements.length > 0) {
      console.log(`   - Achievements: ${verification.missingAchievements.join(', ')}`);
    }

    // Create missing data
    console.log('\n🔨 Creating missing data...');
    const result = await ensureToolkitData(supabase);

    if (result.success) {
      console.log('\n✅ Seed completed successfully!');
      console.log(`   - Categories created: ${result.categoriesCreated}`);
      console.log(`   - Categories updated: ${result.categoriesUpdated}`);
      console.log(`   - Achievements created: ${result.achievementsCreated}`);
    } else {
      console.error('\n❌ Seed completed with errors:');
      result.errors.forEach(error => console.error(`   - ${error}`));
      process.exit(1);
    }

    // Final verification
    console.log('\n🔍 Verifying seed results...');
    const finalVerification = await verifyToolkitData(supabase);
    
    if (finalVerification.isValid) {
      console.log('✅ Database is ready!');
    } else {
      console.error('❌ Some data is still missing after seeding');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Seed failed with error:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();