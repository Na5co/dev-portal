'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FilePlus,
  SlidersHorizontal,
  Book,
  Zap,
  FileText,
} from '@/components/icons';
import Image from 'next/image';

interface HeaderProps {
  logo: string | null;
  activeView: 'documentation' | 'flows';
  onNavigate: (view: 'documentation' | 'flows') => void;
  onCustomizeClick: () => void;
  onDeployClick: () => void;
  isDeploying: boolean;
  onViewDeployedClick: () => void;
  onResetClick: () => void;
}

export const Header = memo(function Header({
  logo,
  activeView,
  onNavigate,
  onCustomizeClick,
  onDeployClick,
  isDeploying,
  onViewDeployedClick,
  onResetClick,
}: HeaderProps) {
  return (
    <header className='border-b bg-white/70 backdrop-blur-sm sticky top-0 z-50 h-[69px]'>
      <div className='flex items-center justify-between px-6 h-full'>
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
        </div>
        <div className='flex items-center gap-2 bg-slate-100 p-1 rounded-lg'>
          <Button
            onClick={() => onNavigate('documentation')}
            variant={activeView === 'documentation' ? 'default' : 'ghost'}
            size='sm'
            className={`transition-all ${
              activeView === 'documentation'
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-600'
            }`}
          >
            <Book className='h-4 w-4 mr-2' />
            Documentation
          </Button>
          <Button
            onClick={() => onNavigate('flows')}
            variant={activeView === 'flows' ? 'default' : 'ghost'}
            size='sm'
            className={`transition-all ${
              activeView === 'flows'
                ? 'bg-white shadow-sm text-slate-900'
                : 'text-slate-600'
            }`}
          >
            <Zap className='h-4 w-4 mr-2' />
            Flows
          </Button>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={onCustomizeClick}
            variant='outline'
            size='sm'
            className='text-slate-600'
          >
            <SlidersHorizontal className='h-4 w-4 mr-2' />
            Customize
          </Button>
          <Button
            onClick={onViewDeployedClick}
            variant='outline'
            size='sm'
            className='text-slate-600'
          >
            <FileText className='h-4 w-4 mr-2' />
            Deployed
          </Button>
          <Button
            onClick={onDeployClick}
            disabled={isDeploying}
            variant='default'
            className='shadow-sm bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent)/0.9)]'
            size='sm'
          >
            <Upload className='h-4 w-4 mr-2' />
            {isDeploying ? 'Deploying...' : 'Deploy'}
          </Button>
          <Button
            onClick={onResetClick}
            variant='outline'
            className='shadow-sm text-slate-600'
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
