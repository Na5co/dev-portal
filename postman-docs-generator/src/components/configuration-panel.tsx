'use client';

import { useEffect, useState, ChangeEvent, memo, FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, XCircle } from '@/components/icons';
import { CustomizationState } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { parsePostmanUid, postmanIdRegex } from '@/components/run-in-postman-button';
import { fontOptions } from '@/lib/constants';

interface ConfigurationPanelProps {
  customization: CustomizationState;
  onCustomizationChange: (newConfig: CustomizationState) => void;
  onClose: () => void;
}

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ConfigurationPanel: FC<ConfigurationPanelProps> = memo(({
  customization,
  onCustomizationChange,
  onClose,
}) => {
  const [isPostmanIdValid, setIsPostmanIdValid] = useState<boolean | null>(null);
  const [isWorkspaceIdValid, setIsWorkspaceIdValid] = useState<boolean | null>(null);

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    field: 'logo' | 'favicon'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      onCustomizationChange({ ...customization, [field]: dataUrl });
    }
  };

  const handleChange = (
    field: keyof CustomizationState,
    value: string | keyof typeof fontOptions
  ) => {
    onCustomizationChange({ ...customization, [field]: value });
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
      postmanUserId: null,
    });
    setIsPostmanIdValid(null);
    setIsWorkspaceIdValid(null);
  };

  return (
    <div
      id='config-panel'
      className='fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6 border-l'
    >
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold'>Customize</h3>
        <Button variant='ghost' size='icon' onClick={onClose}>
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
            onChange={(e) => handleFileChange(e, 'logo')}
            className='mt-2'
          />
        </div>
        <div>
          <Label htmlFor='favicon-upload'>Favicon</Label>
          <Input
            id='favicon-upload'
            type='file'
            accept='image/png, image/svg+xml, image/x-icon'
            onChange={(e) => handleFileChange(e, 'favicon')}
            className='mt-2'
          />
        </div>
        <div>
          <Label htmlFor='accent-color'>Accent Color</Label>
          <Input
            id='accent-color'
            type='color'
            value={customization.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
            className='mt-2'
          />
        </div>
        <div>
          <Label htmlFor='typography-select'>Typography</Label>
          <Select
            value={customization.font}
            onValueChange={(value) => handleChange('font', value)}
          >
            <SelectTrigger id='typography-select' className='mt-2'>
              <SelectValue placeholder='Select a font' />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(fontOptions).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='collectionId'>Run in Postman Collection UID</Label>
            <div className='relative mt-2'>
              <Input
                id='collectionId'
                type='text'
                placeholder='e.g., 12345678-abcd-efgh-ijkl-1234567890ab'
                value={customization.postmanCollectionId || ''}
                onChange={(e) =>
                  handleChange('postmanCollectionId', e.target.value)
                }
              />
              {(() => {
                if (!customization.postmanCollectionId) return null;
                const parsed = parsePostmanUid(
                  customization.postmanCollectionId
                );
                if (!parsed) {
                  return (
                    <p className='text-xs text-red-500 mt-1'>
                      Invalid Postman Collection ID or UID format.
                    </p>
                  );
                }
                if (!parsed.userId) {
                  return (
                    <p className='text-xs text-orange-500 mt-1'>
                      A User ID is required for the "Run in Postman"
                      button. Please provide the full UID.
                    </p>
                  );
                }
                return null;
              })()}
            </div>
          </div>
          <div>
            <Label htmlFor='workspaceId'>Postman Workspace ID</Label>
            <div className='relative mt-2'>
              <Input
                id='workspaceId'
                type='text'
                placeholder='e.g., 12345678-abcd-efgh-ijkl-mnopqrstuvwx'
                value={customization.postmanWorkspaceId || ''}
                onChange={(e) =>
                  handleChange('postmanWorkspaceId', e.target.value)
                }
              />
              {customization.postmanWorkspaceId &&
                !postmanIdRegex.test(
                  customization.postmanWorkspaceId
                ) && (
                  <p className='text-xs text-red-500 mt-1'>
                    Invalid Postman Workspace ID format.
                  </p>
                )}
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor='footer-content'>Footer (Markdown supported)</Label>
          <Textarea
            id='footer-content'
            value={customization.footer}
            onChange={(e) => handleChange('footer', e.target.value)}
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
