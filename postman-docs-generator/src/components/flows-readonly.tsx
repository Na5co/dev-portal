'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Zap, ExternalLink } from 'lucide-react';

interface Flow {
  id: string;
  title: string;
  description?: string;
  src: string;
}

interface FlowsReadonlyProps {
  flows?: Flow[];
}

export const FlowsReadonly: React.FC<FlowsReadonlyProps> = ({ flows = [] }) => {
  // Use provided flows or fall back to default example
  const displayFlows = flows.length > 0 ? flows : [
    {
      id: 'default-flow',
      title: 'Example API Workflow',
      description: `This interactive flow demonstrates a typical **API workflow** including:

- **Authentication** - OAuth 2.0 token generation
- **Data Fetching** - GET requests to retrieve user data  
- **Data Processing** - Transform and validate responses
- **Error Handling** - Graceful failure management

> **Note**: This is a live, interactive flow. You can modify inputs and see real-time results.`,
      src: 'https://flow.pstmn.io/embed/8_fHQGOe5CZhKWZ7O1IK0/?theme=dark&frame=true',
    },
  ];

  return (
    <div className='max-w-6xl mx-auto p-6'>
      {/* Header */}
      <div className='text-center mb-12'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl mb-4'>
          <Zap className='h-8 w-8 text-white' />
        </div>
        <h1 className='text-3xl font-bold text-gray-900 mb-3'>
          Interactive Flows
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Live API workflows that you can interact with, modify, and learn from. 
          Each flow demonstrates real API patterns and best practices.
        </p>
      </div>

      {/* Flows Grid */}
      <div className='space-y-12'>
        {displayFlows.length > 0 ? (
          displayFlows.map((flow, index) => (
            <div key={flow.id} className='group'>
              <Card className='overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-r from-white to-gray-50'>
                <CardHeader className='bg-white border-b border-gray-100'>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg'>
                          <span className='text-white text-sm font-bold'>{index + 1}</span>
                        </div>
                        <CardTitle className='text-xl font-semibold text-gray-900'>
                          {flow.title}
                        </CardTitle>
                      </div>
                      
                      {flow.description && (
                        <div className='prose prose-sm prose-slate max-w-none mt-3'>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {flow.description}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    <div className='flex items-center gap-2 ml-4'>
                      <div className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium'>
                        Interactive
                      </div>
                      <button className='p-2 text-gray-400 hover:text-gray-600 transition-colors'>
                        <ExternalLink className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className='p-0'>
                  <div className='relative'>
                    <div className='aspect-video bg-gray-100 rounded-b-lg overflow-hidden'>
                      <iframe
                        title={flow.title}
                        width='100%'
                        height='100%'
                        allowTransparency={true}
                        className='border-0'
                        style={{ background: 'transparent' }}
                        src={flow.src}
                      />
                    </div>
                    
                    {/* Gradient overlay for visual enhancement */}
                    <div className='absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-900/10 to-transparent pointer-events-none' />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <div className='text-center py-16'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6'>
              <Zap className='h-10 w-10 text-gray-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No flows available</h3>
            <p className='text-gray-500 max-w-md mx-auto'>
              This documentation doesn't include any interactive flows yet. 
              Flows will appear here when they're added to the collection.
            </p>
          </div>
        )}
      </div>

      {/* Enhanced read-only notice */}
      {displayFlows.length > 0 && (
        <div className='mt-16 relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl' />
          <div className='relative bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6'>
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <div className='flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl'>
                  <Zap className='h-5 w-5 text-blue-600' />
                </div>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  📖 About These Flows
                </h3>
                <p className='text-gray-600 mb-3'>
                  These are interactive Postman Flows that demonstrate real API workflows. 
                  You can interact with them, modify inputs, and see live results.
                </p>
                <div className='flex flex-wrap gap-2'>
                  <span className='px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium'>
                    Read-only Mode
                  </span>
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                    Fully Interactive
                  </span>
                  <span className='px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
                    Live Data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
