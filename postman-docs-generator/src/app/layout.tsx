import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Postman Documentation Generator',
  description:
    'Transform your Postman collections into beautiful, modern documentation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          id='font-link'
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
        />
      </head>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
