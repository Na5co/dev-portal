import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deployed Documentation',
  description: 'Deployed API documentation page',
};

export default function DeployedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
