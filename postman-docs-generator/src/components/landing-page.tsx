'use client';

import { memo } from 'react';
import { FileUpload } from '@/components/file-upload';

interface LandingPageProps {
  onFileSelect: (content: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const LandingPage = memo(function LandingPage({
  onFileSelect,
  isLoading,
  error,
}: LandingPageProps) {
  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 bg-gray-900 rounded-2xl mb-6 shadow-lg'>
            <span className='text-white text-3xl'>📚</span>
          </div>
          <h1 className='text-5xl font-bold text-gray-900 mb-4'>
            API Documentation Generator
          </h1>
          <p className='text-lg text-gray-600 mb-8'>
            Instantly turn your Postman collections into clean, beautiful, and
            readable documentation.
          </p>
        </div>

        <FileUpload
          onFileSelect={onFileSelect}
          isLoading={isLoading}
        />

        {error && (
          <div className='mt-8 p-4 bg-red-100 border border-red-200 rounded-lg text-red-800 text-center shadow-sm'>
            <p>{error}</p>
          </div>
        )}

        <div className='mt-16 text-center'>
          <div className='grid md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h3 className='font-semibold text-lg mb-2'>Simple to Use</h3>
              <p className='text-gray-600 text-sm'>
                Just drag and drop your exported Postman JSON file.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h3 className='font-semibold text-lg mb-2'>Instant Previews</h3>
              <p className='text-gray-600 text-sm'>
                See your documentation generated in real-time.
              </p>
            </div>
            <div className='bg-white p-6 rounded-lg shadow-sm border'>
              <h3 className='font-semibold text-lg mb-2'>Exportable</h3>
              <p className='text-gray-600 text-sm'>
                Download a single HTML file for easy hosting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
