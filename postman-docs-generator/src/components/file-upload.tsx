'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  onFileSelect: (content: string) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileSelect, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please select a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <Card
      className={`w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-300 ${
        dragActive ? 'scale-105 shadow-2xl' : ''
      }`}
    >
      <CardContent className='p-8'>
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/80 scale-105'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className='space-y-6'>
            <div className='mx-auto w-16 h-16 text-gray-400'>
              {isLoading ? (
                <div className='animate-spin w-full h-full border-4 border-blue-500 border-t-transparent rounded-full'></div>
              ) : (
                <svg
                  className='w-full h-full'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
              )}
            </div>

            <div>
              <Label className='text-2xl font-bold text-gray-900 mb-3 block'>
                Upload your Postman Collection
              </Label>
              <p className='text-gray-600 leading-relaxed max-w-md mx-auto'>
                Drag and drop your .json collection file here, or click the
                button below to browse your files
              </p>
            </div>

            <Button
              onClick={() => inputRef.current?.click()}
              disabled={isLoading}
              className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
            >
              {isLoading ? (
                <span className='flex items-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Processing...
                </span>
              ) : (
                <span className='flex items-center gap-2'>
                  <span>📁</span>
                  Choose File
                </span>
              )}
            </Button>

            <div className='text-xs text-gray-500'>
              Supports Postman Collection v2.0 and v2.1 formats
            </div>

            <input
              ref={inputRef}
              type='file'
              accept='.json,application/json'
              onChange={handleChange}
              className='hidden'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
