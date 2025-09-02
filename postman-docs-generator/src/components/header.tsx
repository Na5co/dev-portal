'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FilePlus, SlidersHorizontal } from '@/components/icons';
import Image from 'next/image';

interface HeaderProps {
  logo: string | null;
  onCustomizeClick: () => void;
  onExportClick: () => void;
  onResetClick: () => void;
}

export const Header = memo(function Header({
  logo,
  onCustomizeClick,
  onExportClick,
  onResetClick,
}: HeaderProps) {
  return (
    <header className='border-b bg-white/70 backdrop-blur-sm sticky top-0 z-50 h-[69px]'>
      <div className='flex items-center justify-between px-6'>
        <div className='flex items-center gap-3'>
          {logo ? (
            <Image
              src={logo}
              alt='Logo'
              width={32}
              height={32}
              className='h-8 w-auto'
            />
          ) : (
            <div className='w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center'>
              <span className='text-white text-lg'>📚</span>
            </div>
          )}
          <h1 className='text-lg font-bold text-gray-900'>API Documentation</h1>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={onCustomizeClick}
            variant='outline'
            size='sm'
            className='text-gray-600'
          >
            <SlidersHorizontal className='h-4 w-4 mr-2' />
            Customize
          </Button>
          <Button
            onClick={onExportClick}
            variant='default'
            className='shadow-sm bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]'
            size='sm'
          >
            <Download className='h-4 w-4 mr-2' />
            Export
          </Button>
          <Button
            onClick={onResetClick}
            variant='outline'
            className='shadow-sm text-gray-600'
            size='sm'
          >
            <FilePlus className='h-4 w-4 mr-2' />
            New Collection
          </Button>
        </div>
      </div>
    </header>
  );
});
