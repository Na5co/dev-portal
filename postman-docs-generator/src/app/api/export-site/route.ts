import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import archiver from 'archiver';
import { copyDir } from '@/lib/export-fs-utils';

const execPromise = (command: string, options: { cwd: string }) => {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Exec error for command: ${command}`);
        console.error('Stderr:', stderr);
        if (stdout) {
            console.error('Stdout:', stdout);
        }
        reject(new Error(`Command failed: ${command}\n${stderr}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

// Static page template is now loaded from a separate file

async function setupSandbox(sandboxDir: string, collection: any, customization: any) {
  const templateDir = path.join(process.cwd(), 'src', 'lib', 'export-template');
  const srcDir = path.join(process.cwd(), 'src');
  const sandboxAppDir = path.join(sandboxDir, 'src', 'app');

  // 1. Copy config templates
  await fs.copyFile(path.join(templateDir, 'package.json.template'), path.join(sandboxDir, 'package.json'));
  await fs.copyFile(path.join(templateDir, 'next.config.js.template'), path.join(sandboxDir, 'next.config.js'));
  await fs.copyFile(path.join(templateDir, 'tailwind.config.js.template'), path.join(sandboxDir, 'tailwind.config.js'));
  await fs.copyFile(path.join(templateDir, 'postcss.config.js.template'), path.join(sandboxDir, 'postcss.config.js'));
  await fs.copyFile(path.join(templateDir, 'tsconfig.json.template'), path.join(sandboxDir, 'tsconfig.json'));
  
  // 2. Copy only essential lib files (minimal approach to avoid issues)
  const libDir = path.join(sandboxDir, 'src', 'lib');
  await fs.mkdir(libDir, { recursive: true });
  
  // Copy only the essential files for the static export
  const essentialFiles = [
    'postman-parser.ts',
    'types.ts', 
    'colors.ts',
    'constants.ts'
  ];
  
  for (const filename of essentialFiles) {
    const srcPath = path.join(srcDir, 'lib', filename);
    const destPath = path.join(libDir, filename);
    try {
      await fs.copyFile(srcPath, destPath);
    } catch (err) {
      console.warn(`Could not copy ${filename}, continuing...`);
    }
  }
  
  // Copy types directory if it exists
  const typesDir = path.join(srcDir, 'types');
  try {
    await fs.access(typesDir);
    await copyDir(typesDir, path.join(sandboxDir, 'src', 'types'));
  } catch {
    // types directory doesn't exist, that's fine
  }
  
  // 3. Create simplified app structure for static export
  await fs.mkdir(sandboxAppDir, { recursive: true });
  await fs.copyFile(path.join(srcDir, 'app', 'globals.css'), path.join(sandboxAppDir, 'globals.css'));
  
  // Create a simplified layout for static export
  const simpleLayout = `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Generated API documentation from Postman collection',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer" />
        <link
          id="font-link"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
`;
  
  await fs.writeFile(path.join(sandboxAppDir, 'layout.tsx'), simpleLayout);
  
  // 4. Create public directory and save data
  const publicDir = path.join(sandboxDir, 'public');
  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(
    path.join(publicDir, 'data.json'),
    JSON.stringify({ collection, customization }, null, 2)
  );

  // 5. Copy the page template
  const pagePath = path.join(sandboxAppDir, 'page.tsx');
  await fs.copyFile(path.join(templateDir, 'page.tsx.template'), pagePath);
}

export async function POST(req: NextRequest) {
  try {
    const { collection, customization } = await req.json();

    if (!collection) {
      return new NextResponse('Bad Request: Collection data is required', { status: 400 });
    }

    const sandboxDir = await fs.mkdtemp(path.join(os.tmpdir(), 'portal-export-'));
    console.log(`[Export] Sandbox created at: ${sandboxDir}`);

    try {
        await setupSandbox(sandboxDir, collection, customization);
        console.log(`[Export] Sandbox setup complete.`);

        console.log(`[Export] Installing dependencies...`);
        await execPromise('npm i --legacy-peer-deps', { cwd: sandboxDir });
        console.log(`[Export] Dependencies installed.`);

        console.log(`[Export] Building static site...`);
        const buildCommand = 'NODE_ENV=production npm run build';
        await execPromise(buildCommand, { cwd: sandboxDir });
        console.log(`[Export] Build complete.`);

        const outDir = path.join(sandboxDir, 'out');
        const archive = archiver('zip', { zlib: { level: 9 } });
        const zipPromise = new Promise<Buffer>((resolve, reject) => {
            const buffers: Buffer[] = [];
            archive.on('data', (buffer) => buffers.push(buffer));
            archive.on('end', () => resolve(Buffer.concat(buffers)));
            archive.on('error', reject);
        });

        archive.directory(outDir, false);
        await archive.finalize();
        
        const zipBuffer = await zipPromise;
        console.log(`[Export] Zipping complete. Size: ${zipBuffer.length} bytes.`);

        return new NextResponse(zipBuffer as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${collection?.name?.replace(/\s/g, '_') || 'documentation'}_docs.zip"`,
            },
        });

    } finally {
        console.log(`[Export] Cleaning up sandbox: ${sandboxDir}`);
        await fs.rm(sandboxDir, { recursive: true, force: true });
    }

  } catch (error) {
    console.error('Export failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
