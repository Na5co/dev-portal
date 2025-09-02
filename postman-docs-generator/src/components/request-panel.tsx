'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParsedRequest } from '@/lib/postman-parser';
import { getMethodColor, formatJson } from '@/lib/utils';
import {
  Code,
  Lock,
  ArrowRight,
  Clipboard,
  ClipboardCheck,
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface RequestPanelProps {
  rawRequest?: object;
  request: ParsedRequest;
}

const languages = [
  { id: 'curl', name: 'cURL' },
  { id: 'javascript-fetch', name: 'JavaScript' },
  { id: 'php-curl', name: 'PHP' },
];

export function RequestPanel({ request, rawRequest }: RequestPanelProps) {
  const [activeLanguage, setActiveLanguage] = useState(languages[0].id);
  const [snippet, setSnippet] = useState<string | null>(null);
  const [isLoadingSnippet, setIsLoadingSnippet] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const generateSnippet = async () => {
      if (!rawRequest) return;
      setIsLoadingSnippet(true);
      try {
        const response = await fetch('/api/generate-snippet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawRequest, language: activeLanguage }),
        });
        if (response.ok) {
          const data = await response.json();
          setSnippet(data.snippet);
        } else {
          setSnippet('Error generating snippet.');
        }
      } catch (error) {
        setSnippet('Error generating snippet.');
      } finally {
        setIsLoadingSnippet(false);
      }
    };
    generateSnippet();
  }, [activeLanguage, rawRequest]);

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
      {/* Left Column for Metadata */}
      <div className='space-y-6'>
        {request.auth && (
          <Card className='shadow-lg hover:shadow-xl transition-shadow rounded-xl'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold flex items-center gap-2'>
                <Lock
                  className='h-5 w-5 text-gray-500'
                  aria-hidden='true'
                />
                Authorization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <tbody>
                    <tr className='border-t'>
                      <td className='p-2 font-mono text-gray-800 font-medium'>
                        Type
                      </td>
                      <td className='p-2 font-mono text-gray-600'>
                        {request.auth.type}
                      </td>
                    </tr>
                    {Object.entries(request.auth)
                      .filter(([key]) => key !== 'type')
                      .map(([key, value]) => (
                        <tr
                          key={key}
                          className='border-t'
                        >
                          <td className='p-2 font-mono text-gray-800 font-medium capitalize'>
                            {key}
                          </td>
                          <td className='p-2 font-mono text-gray-600'>
                            {String(value)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {request.headers && request.headers.length > 0 && (
          <Card className='shadow-lg hover:shadow-xl transition-shadow rounded-xl'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold'>Headers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='text-left text-gray-500'>
                    <tr>
                      <th className='p-2 font-medium'>Key</th>
                      <th className='p-2 font-medium'>Value</th>
                      <th className='p-2 font-medium'>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.headers.map((header, idx) => (
                      <tr
                        key={idx}
                        className='border-t'
                      >
                        <td className='p-2 font-mono text-gray-800'>
                          {header.key}
                        </td>
                        <td className='p-2 font-mono text-gray-600'>
                          {header.value}
                        </td>
                        <td className='p-2 text-gray-600'>
                          {header.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column for Payloads */}
      <div className='bg-gray-900 rounded-xl shadow-2xl lg:sticky lg:top-24'>
        <div className='p-4 border-b border-gray-700 flex justify-between items-center'>
          <h4 className='text-lg font-semibold text-white flex items-center gap-2'>
            <Code
              className='h-5 w-5 text-blue-400'
              aria-hidden='true'
            />
            Request & Response
          </h4>
          <div className='flex items-center gap-1 bg-gray-800/60 p-1 rounded-lg'>
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveLanguage(lang.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeLanguage === lang.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-gray-400 hover:bg-gray-700/50'
                }`}
                style={
                  activeLanguage === lang.id
                    ? {
                        backgroundColor: 'hsl(var(--accent))',
                        color: 'hsl(var(--accent-foreground))',
                      }
                    : {}
                }
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <ScrollArea className='max-h-[calc(100vh-200px)]'>
          <div className='p-4 space-y-6'>
            <Accordion
              type='single'
              collapsible
              className='w-full'
            >
              <AccordionItem
                value='item-1'
                className='border-none'
              >
                <AccordionTrigger className='hover:no-underline p-2 text-gray-300 hover:text-white rounded-md hover:bg-gray-800'>
                  <span className='text-base font-semibold'>Code Snippet</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className='relative mt-2'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='absolute top-2 right-2 h-8 w-8 text-gray-400 hover:bg-gray-700 hover:text-white'
                      onClick={handleCopy}
                    >
                      {hasCopied ? (
                        <ClipboardCheck className='h-4 w-4' />
                      ) : (
                        <Clipboard className='h-4 w-4' />
                      )}
                    </Button>
                    <div className='bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto'>
                      <pre className='text-sm text-gray-200'>
                        <code>{isLoadingSnippet ? 'Loading...' : snippet}</code>
                      </pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {request.body &&
              (request.body.raw ||
                (request.body.formdata &&
                  request.body.formdata.length > 0)) && (
                <div>
                  <h5 className='text-base font-semibold text-gray-300 mb-2'>
                    Request Body
                  </h5>
                  {request.body.raw && (
                    <div className='bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto'>
                      <pre className='text-sm text-gray-200'>
                        <code>{formatJson(request.body.raw)}</code>
                      </pre>
                    </div>
                  )}
                  {request.body.formdata && (
                    <div className='space-y-2'>
                      {request.body.formdata.map((param, idx) => (
                        <div
                          key={idx}
                          className='flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600'
                        >
                          <span className='font-mono text-sm font-medium text-gray-200'>
                            {param.key}
                          </span>
                          <span className='font-mono text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-600'>
                            {param.value}
                          </span>
                          <Badge
                            variant='outline'
                            className='border-gray-500 text-gray-300'
                          >
                            {param.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            {request.examples && request.examples.length > 0 && (
              <div className='space-y-4'>
                {request.examples.map((example, idx) => (
                  <div key={idx}>
                    <h5 className='text-base font-semibold text-gray-300 mb-2 flex items-center justify-between'>
                      <span>
                        <ArrowRight className='inline h-4 w-4 mr-2 text-green-400' />
                        Response Example:{' '}
                        <span className='font-light'>{example.name}</span>
                      </span>
                      <Badge
                        className={`font-semibold ${
                          example.code < 300
                            ? 'bg-green-900 text-green-300 border-green-700'
                            : 'bg-red-900 text-red-300 border-red-700'
                        }`}
                      >
                        {example.code}
                      </Badge>
                    </h5>
                    {example.body && (
                      <div className='bg-gray-800 rounded-lg p-4 max-h-80 overflow-auto'>
                        <pre className='text-sm text-gray-200'>
                          <code>{formatJson(example.body)}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
