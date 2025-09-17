import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deploymentId = params.id;
    
    if (!deploymentId) {
      return new NextResponse('Bad Request: Deployment ID is required', { status: 400 });
    }

    // Read the deployed page data from the public/deployed directory
    const deployedDir = path.join(process.cwd(), 'public', 'deployed');
    const filePath = path.join(deployedDir, `${deploymentId}.json`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const deployedPage = JSON.parse(fileContent);
      
      return NextResponse.json(deployedPage);
    } catch (fileError) {
      console.error(`Error reading deployment file ${deploymentId}:`, fileError);
      return new NextResponse('Deployment not found', { status: 404 });
    }

  } catch (error) {
    console.error('Failed to get deployed page:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
