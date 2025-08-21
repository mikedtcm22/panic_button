import { checkEnvironment } from '../config/env-check';

export function generateSetupGuide(): string {
  const config = checkEnvironment();
  
  return `# Local Development Setup

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment:**
   \`\`\`bash
   npm run setup:dev
   \`\`\`
   This will create a .env.local file and initialize the database.

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Current Configuration

${config.mockMode ? '✅ **Running in Mock Mode** - No API keys required!' : '⚠️ **Production Mode** - API keys required'}

### Service Status:
- ${config.clerk.configured ? '✅' : '❌'} Clerk Authentication${!config.clerk.configured ? `\n  ${config.clerk.instructions}` : ''}
- ${config.openai.configured ? '✅' : '❌'} OpenAI API${!config.openai.configured ? `\n  ${config.openai.instructions}` : ''}
- ${config.r2.configured ? '✅' : '❌'} Cloudflare R2 Storage${!config.r2.configured ? `\n  ${config.r2.instructions}` : ''}
- ${config.database.configured ? '✅' : '❌'} Database${!config.database.configured ? `\n  ${config.database.instructions}` : ''}

## Available Pages

- \`/\` - Homepage
- \`/demo\` - Component showcase and testing
- \`/api/health\` - Service health check
${config.clerk.configured ? '- \`/sign-in\` - Sign in page\n- \`/sign-up\` - Sign up page\n- \`/profile\` - User profile' : ''}

## Testing Features

### Without API Keys (Mock Mode):
- Browse all UI components
- Test navigation and layouts
- Try mock panic button responses
- Preview loading states and animations

### With API Keys:
- Full authentication flow
- Real file uploads
- Live AI text generation
- Database persistence

## Troubleshooting

### Port already in use
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
\`\`\`

### Database errors
\`\`\`bash
# Reset database
rm prisma/dev.db
npx prisma db push
\`\`\`

### Module not found
\`\`\`bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
\`\`\`

## Next Steps

1. Visit \`/demo\` to explore components
2. Check \`/api/health\` for service status
3. Obtain API keys for full functionality
4. Read phase documentation in \`/Docs/phases/\`

---
Generated on: ${new Date().toLocaleString()}
`;
}