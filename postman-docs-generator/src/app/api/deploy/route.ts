import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Interface for deployed page metadata
interface DeployedPage {
  id: string;
  name: string;
  description?: string;
  deployedAt: string;
  collection: any;
  customization: any;
}

export async function POST(req: NextRequest) {
  try {
    const { collection, customization } = await req.json();

    if (!collection) {
      return new NextResponse('Bad Request: Collection data is required', { status: 400 });
    }

    // Create a unique ID for this deployment
    const deploymentId = `${collection.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'collection'}_${Date.now()}`;
    
    // Ensure the deployed directory exists
    const deployedDir = path.join(process.cwd(), 'public', 'deployed');
    try {
      await fs.access(deployedDir);
    } catch {
      await fs.mkdir(deployedDir, { recursive: true });
    }

    // Create the deployment data
    const deployedPage: DeployedPage = {
      id: deploymentId,
      name: collection.name || 'Untitled Collection',
      description: collection.description || '',
      deployedAt: new Date().toISOString(),
      collection,
      customization,
    };

    // Save the deployed page data
    const filePath = path.join(deployedDir, `${deploymentId}.json`);
    await fs.writeFile(filePath, JSON.stringify(deployedPage, null, 2));

    console.log(`[Deploy] Page deployed successfully with ID: ${deploymentId}`);

    return NextResponse.json({
      success: true,
      deploymentId,
      url: `/deployed/${deploymentId}`,
      message: 'Documentation page deployed successfully!'
    });

  } catch (error) {
    console.error('Deployment failed:', error);
    return new NextResponse('Internal Server Error: Deployment failed', { status: 500 });
  }
}

// GET endpoint to list all deployed pages
export async function GET() {
  try {
    const deployedDir = path.join(process.cwd(), 'public', 'deployed');
    
    // Check if directory exists
    try {
      await fs.access(deployedDir);
    } catch {
      return NextResponse.json({ deployments: [] });
    }

    // Read all deployment files
    const files = await fs.readdir(deployedDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const deployments = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const filePath = path.join(deployedDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const deployment: DeployedPage = JSON.parse(content);
          
          // Return only metadata (without full collection data)
          return {
            id: deployment.id,
            name: deployment.name,
            description: deployment.description,
            deployedAt: deployment.deployedAt,
            url: `/deployed/${deployment.id}`
          };
        } catch (error) {
          console.error(`Error reading deployment file ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed reads and sort by deployment date (newest first)
    const validDeployments = deployments
      .filter(Boolean)
      .sort((a, b) => new Date(b!.deployedAt).getTime() - new Date(a!.deployedAt).getTime());

    return NextResponse.json({ deployments: validDeployments });

  } catch (error) {
    console.error('Failed to list deployments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
