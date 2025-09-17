'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, Trash2, Zap } from 'lucide-react';

interface Flow {
  id: string;
  title: string;
  description?: string;
  src: string;
}

export const Flows: React.FC = () => {
  const [flows, setFlows] = useState<Flow[]>([
    {
      id: 'initial-flow',
      title: 'Example API Workflow',
      description: 'This is an example of an embedded Postman Flow demonstrating API interactions.',
      src: 'https://flow.pstmn.io/embed/8_fHQGOe5CZhKWZ7O1IK0/?theme=dark&frame=true',
    },
  ]);
  const [newFlowTitle, setNewFlowTitle] = useState('');
  const [newFlowDescription, setNewFlowDescription] = useState('');
  const [newFlowSrc, setNewFlowSrc] = useState('');

  const handleAddFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowTitle || !newFlowSrc) return;

    // A simple regex to extract the src from a full iframe tag if pasted
    const srcMatch = newFlowSrc.match(/src="([^"]+)"/);
    const src = srcMatch ? srcMatch[1] : newFlowSrc;

    const newFlow: Flow = {
      id: new Date().toISOString(),
      title: newFlowTitle,
      description: newFlowDescription || undefined,
      src: src,
    };
    setFlows([...flows, newFlow]);
    setNewFlowTitle('');
    setNewFlowDescription('');
    setNewFlowSrc('');
  };

  const handleDeleteFlow = (id: string) => {
    setFlows(flows.filter((flow) => flow.id !== id));
  };

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 lg:p-8'>
      <div className='pb-8'>
        <h1 className='text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900'>
          Postman Flows
        </h1>
        <p className='mt-4 text-lg text-gray-600'>
          A collection of embedded Postman Flows that demonstrate various API
          workflows.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
        <div className='lg:col-span-2 grid grid-cols-1 gap-8'>
          {flows.length > 0 ? (
            flows.map((flow) => (
              <Card key={flow.id} className='shadow-sm'>
                <CardHeader className='flex flex-row justify-between items-start'>
                  <CardTitle className='text-lg font-semibold'>
                    {flow.title}
                  </CardTitle>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDeleteFlow(flow.id)}
                    className='text-slate-500 hover:bg-slate-100 hover:text-red-500 h-8 w-8'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </CardHeader>
                <CardContent>
                  {flow.description && (
                    <div className='mb-4 text-sm text-slate-600'>
                      {flow.description}
                    </div>
                  )}
                  <div className='aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border'>
                    <iframe
                      title={flow.title}
                      width='100%'
                      height='450'
                      allowTransparency={true}
                      style={{ background: 'none', border: 'none' }}
                      src={flow.src}
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className='lg:col-span-2 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed rounded-lg p-12 text-center'>
              <Zap className='h-12 w-12 text-slate-400 mb-4' />
              <h3 className='text-xl font-semibold text-slate-700'>No flows yet</h3>
              <p className='text-slate-500 mt-2'>
                Add your first Postman Flow using the form.
              </p>
            </div>
          )}
        </div>

        <Card className='lg:sticky lg:top-24 shadow-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <PlusCircle className='h-5 w-5' />
              Add a new Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFlow} className='space-y-4'>
              <div>
                <label
                  htmlFor='flow-title'
                  className='block text-sm font-medium text-slate-700 mb-1'
                >
                  Title
                </label>
                <Input
                  id='flow-title'
                  placeholder='e.g., User Authentication Flow'
                  value={newFlowTitle}
                  onChange={(e) => setNewFlowTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='flow-description'
                  className='block text-sm font-medium text-slate-700 mb-1'
                >
                  Description (Markdown supported)
                </label>
                <Textarea
                  id='flow-description'
                  placeholder='Describe what this flow does... 

**Example:**
- Authenticates users
- Fetches user data
- Handles errors gracefully'
                  value={newFlowDescription}
                  onChange={(e) => setNewFlowDescription(e.target.value)}
                  rows={4}
                />
                <p className='text-xs text-slate-500 mt-1'>
                  Optional. Use markdown for formatting (bold, lists, etc.)
                </p>
              </div>
              <div>
                <label
                  htmlFor='flow-src'
                  className='block text-sm font-medium text-slate-700 mb-1'
                >
                  Embed URL or &lt;iframe&gt;
                </label>
                <Input
                  id='flow-src'
                  placeholder='Paste the src URL or the full iframe code'
                  value={newFlowSrc}
                  onChange={(e) => setNewFlowSrc(e.target.value)}
                  required
                />
              </div>
              <Button type='submit' className='w-full'>
                Add Flow
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
