import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bannersDir = path.join(process.cwd(), 'public', 'banners');

    // Create directory if it doesn't exist
    if (!fs.existsSync(bannersDir)) {
      fs.mkdirSync(bannersDir, { recursive: true });
      return NextResponse.json([]);
    }

    // Read all files from banners directory
    const files = fs.readdirSync(bannersDir);

    // Filter only image files and sort alphabetically
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const bannerImages = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
      .map(file => `/banners/${file}`);

    return NextResponse.json(bannerImages);
  } catch (error) {
    console.error('Error reading banner images:', error);
    return NextResponse.json([]);
  }
}
