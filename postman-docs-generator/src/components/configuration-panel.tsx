'use client';

import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle } from '@/components/icons';
import { CustomizationState } from '@/app/page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { isValidPostmanId } from './run-in-postman-button';

interface ConfigurationPanelProps {
  customization: CustomizationState;
  onCustomizationChange: (newConfig: CustomizationState) => void;
  onClose: () => void;
}

export const ConfigurationPanel = memo(function ConfigurationPanel({
  customization,
  onCustomizationChange,
  onClose,
}: ConfigurationPanelProps) {
  const [isPostmanIdValid, setIsPostmanIdValid] = useState<boolean | null>(
    null
  );
  const [isWorkspaceIdValid, setIsWorkspaceIdValid] = useState<boolean | null>(
    null
  );

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCustomizationChange({
          ...customization,
          logo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCustomizationChange({
          ...customization,
          favicon: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomizationChange({ ...customization, accentColor: e.target.value });
  };

  const handleFontChange = (value: keyof typeof fontOptions) => {
    onCustomizationChange({ ...customization, font: value });
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCustomizationChange({ ...customization, footer: e.target.value });
  };

  const handlePostmanIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    onCustomizationChange({ ...customization, postmanCollectionId: id });
    if (id) {
      setIsPostmanIdValid(isValidPostmanId(id));
    } else {
      setIsPostmanIdValid(null);
    }
  };

  const handleWorkspaceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    onCustomizationChange({ ...customization, postmanWorkspaceId: id });
    if (id) {
      setIsWorkspaceIdValid(isValidPostmanId(id));
    } else {
      setIsWorkspaceIdValid(null);
    }
  };

  const resetToDefaults = () => {
    onCustomizationChange({
      logo: null,
      accentColor: '#000000',
      favicon: null,
      font: 'inter',
      footer: '',
      postmanCollectionId: null,
      postmanWorkspaceId: null,
    });
    setIsPostmanIdValid(null);
    setIsWorkspaceIdValid(null);
  };

  const fontOptions = {
    inter: 'Inter (Sans-serif)',
    'roboto-mono': 'Roboto Mono (Monospace)',
    'source-serif': 'Source Serif (Serif)',
  };

  return (
    <div
      id='config-panel'
      className='fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6 border-l'
    >
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Customize</h3>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
        >
          <X className='h-5 w-5' />
        </Button>
      </div>

      <div className='space-y-6'>
        <div>
          <Label htmlFor='logo-upload'>Logo</Label>
          <Input
            id='logo-upload'
            type='file'
            accept='image/*'
            onChange={handleLogoChange}
            className='mt-2'
          />
        </div>
        <div>
          <Label htmlFor='favicon-upload'>Favicon</Label>
          <Input
            id='favicon-upload'
            type='file'
            accept='image/png, image/svg+xml, image/x-icon'
            onChange={handleFaviconChange}
            className='mt-2'
          />
        </div>
        <div>
          <Label htmlFor='accent-color'>Accent Color</Label>
          <Input
            id='accent-color'
            type='color'
            value={customization.accentColor}
            onChange={handleColorChange}
            className='mt-2'
          />
        </div>
        <div>
          <Label htmlFor='typography-select'>Typography</Label>
          <Select
            value={customization.font}
            onValueChange={handleFontChange}
          >
            <SelectTrigger
              id='typography-select'
              className='mt-2'
            >
              <SelectValue placeholder='Select a font' />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fontOptions).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='postman-id'>Run in Postman Collection ID</Label>
            <div className='relative mt-2'>
              <Input
                id='postman-id'
                type='text'
                value={customization.postmanCollectionId || ''}
                onChange={handlePostmanIdChange}
                placeholder='e.g., 12345678-abcd-efgh-ijkl-mnopqrstuvwx'
                className={isPostmanIdValid === false ? 'border-red-500' : ''}
              />
              {isPostmanIdValid === true && (
                <CheckCircle className='absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500' />
              )}
              {isPostmanIdValid === false && (
                <XCircle className='absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500' />
              )}
            </div>
            {isPostmanIdValid === false && (
              <p className='text-xs text-red-500 mt-1'>
                Invalid Postman collection ID format.
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='postman-workspace-id'>
              Postman Workspace ID (Optional)
            </Label>
            <div className='relative mt-2'>
              <Input
                id='postman-workspace-id'
                type='text'
                value={customization.postmanWorkspaceId || ''}
                onChange={handleWorkspaceIdChange}
                placeholder='e.g., 12345678-abcd-efgh-ijkl-mnopqrstuvwx'
                className={isWorkspaceIdValid === false ? 'border-red-500' : ''}
              />
              {isWorkspaceIdValid === true && (
                <CheckCircle className='absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500' />
              )}
              {isWorkspaceIdValid === false && (
                <XCircle className='absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500' />
              )}
            </div>
            {isWorkspaceIdValid === false && (
              <p className='text-xs text-red-500 mt-1'>
                Invalid Postman workspace ID format.
              </p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor='footer-content'>Footer (Markdown supported)</Label>
          <Textarea
            id='footer-content'
            value={customization.footer}
            onChange={handleFooterChange}
            className='mt-2 h-24'
            placeholder='© 2024 Your Company Name'
          />
        </div>
        <Button
          variant='outline'
          onClick={resetToDefaults}
          className='w-full'
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
});
