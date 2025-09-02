import { NextRequest, NextResponse } from 'next/server';
import { Request } from 'postman-collection';
import * as codegen from 'postman-code-generators';

const languages = [
  { id: 'curl', name: 'cURL', lang: 'curl', variant: 'cURL' },
  {
    id: 'javascript-fetch',
    name: 'JavaScript',
    lang: 'javascript',
    variant: 'fetch',
  },
  { id: 'php-curl', name: 'PHP', lang: 'php', variant: 'curl' },
];

export async function POST(req: NextRequest) {
  try {
    const { rawRequest, language } = await req.json();

    if (!rawRequest || !language) {
      return NextResponse.json(
        { error: 'Missing request data or language' },
        { status: 400 }
      );
    }

    const postmanRequest = new Request(rawRequest);

    const selectedLanguage = languages.find((l) => l.id === language);
    if (!selectedLanguage) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    const snippet = await new Promise<string | null>((resolve, reject) => {
      codegen.convert(
        selectedLanguage.lang,
        selectedLanguage.variant,
        postmanRequest,
        {},
        (error: Error | null, snippet: string | null) => {
          if (error) {
            return reject(error);
          }
          resolve(snippet);
        }
      );
    });

    if (snippet === null) {
      return NextResponse.json(
        { error: 'Failed to generate snippet' },
        { status: 500 }
      );
    }

    return NextResponse.json({ snippet });
  } catch (error) {
    console.error('Snippet generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
