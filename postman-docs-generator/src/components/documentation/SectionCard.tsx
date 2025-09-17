import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  children,
}) => {
  return (
    <Card className='shadow-sm hover:shadow-md transition-shadow rounded-lg border-slate-200'>
      {title && (
        <CardHeader>
          <CardTitle className='text-base font-semibold flex items-center gap-2 text-slate-700'>
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};
