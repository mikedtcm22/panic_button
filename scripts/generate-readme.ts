import * as fs from 'fs';
import * as path from 'path';
import { generateSetupGuide } from '../src/lib/docs/setup-guide';

export async function generateReadme(): Promise<void> {
  const guide = generateSetupGuide();
  const readmePath = path.join(process.cwd(), 'LOCAL_TESTING.md');
  
  fs.writeFileSync(readmePath, guide);
  console.log('✅ LOCAL_TESTING.md generated successfully');
}

// Run if called directly
if (require.main === module) {
  generateReadme().catch(error => {
    console.error('Failed to generate README:', error);
    process.exit(1);
  });
}