import React from 'react';
import { DebugChapter3Loader } from '@/components/testing/DebugChapter3Loader';

export default function DebugChapter3() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Debug Chapter 3 Component Loading
        </h1>
        <DebugChapter3Loader />
      </div>
    </div>
  );
}