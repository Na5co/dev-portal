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
    <div className='bg-white border border-slate-200 rounded-lg shadow-sm'>
      <div className='p-4 border-b border-slate-200 flex justify-between items-center'>
        <h4 className='text-lg font-semibold text-slate-900 flex items-center gap-2'>
          <Code
            className='h-5 w-5 text-blue-500'
            aria-hidden='true'
          />
          Request & Response
        </h4>
        <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-lg'>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLanguage(lang.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeLanguage === lang.id
                  ? 'bg-white shadow-sm text-slate-900'
                  : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      <div className='p-4'>
        <Accordion
          type='multiple'
          className='w-full space-y-2'
          defaultValue={['code-snippet']}
        >
          <AccordionItem
            value='code-snippet'
            className='border-none'
          >
            <div className='bg-slate-50 rounded-lg border border-slate-200'>
              <AccordionTrigger className='hover:no-underline p-3 text-slate-700 hover:text-slate-900 rounded-md'>
                <span className='text-base font-semibold'>Code Snippet</span>
              </AccordionTrigger>
              <AccordionContent className='p-1'>
                <div className='relative mx-2 mb-2'>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='absolute top-2 right-2 h-8 w-8 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                    onClick={handleCopy}
                  >
                    {hasCopied ? (
                      <ClipboardCheck className='h-4 w-4' />
                    ) : (
                      <Clipboard className='h-4 w-4' />
                    )}
                  </Button>
                  <div className='bg-slate-800 text-slate-100 rounded-lg p-4 overflow-x-auto'>
                    <pre className='text-sm'>
                      <code>{isLoadingSnippet ? 'Loading...' : snippet}</code>
                    </pre>
                  </div>
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>

          {request.examples && request.examples.length > 0 && (
            <AccordionItem
              value='response-examples'
              className='border-none'
            >
              <div className='bg-slate-50 rounded-lg border border-slate-200'>
                <AccordionTrigger className='hover:no-underline p-3 text-slate-700 hover:text-slate-900 rounded-md'>
                  <span className='text-base font-semibold'>
                    Response Examples
                  </span>
                </AccordionTrigger>
                <AccordionContent className='p-1'>
                  <div className='mx-2 mb-2'>
                    <Accordion
                      type='multiple'
                      className='w-full space-y-2'
                    >
                      {request.examples.map((example, idx) => (
                        <AccordionItem
                          key={idx}
                          value={`response-${idx}`}
                          className='border-none'
                        >
                          <div className='bg-white rounded-lg border border-slate-200'>
                            <AccordionTrigger className='hover:no-underline p-3 text-slate-700 hover:text-slate-900 rounded-md'>
                              <div className='w-full flex justify-between items-center'>
                                <span className='text-sm font-medium flex items-center gap-2'>
                                  <ArrowRight className='h-4 w-4 text-green-500' />
                                  {example.name}
                                </span>
                                <Badge
                                  className={`font-semibold ${
                                    example.code < 300
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : 'bg-red-100 text-red-800 border-red-200'
                                  }`}
                                >
                                  {example.code}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className='p-1'>
                              {example.body && (
                                <div className='bg-slate-800 text-slate-100 rounded-lg p-4 mx-2 mb-2 overflow-x-auto'>
                                  <pre className='text-sm'>
                                    <code>{formatJson(example.body)}</code>
                                  </pre>
                                </div>
                              )}
                            </AccordionContent>
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </AccordionContent>
              </div>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
}
