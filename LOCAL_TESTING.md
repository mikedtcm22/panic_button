# Local Development Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   npm run setup:dev
   ```
   This will create a .env.local file and initialize the database.

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Current Configuration

⚠️ **Production Mode** - API keys required

### Service Status:
- ❌ Clerk Authentication
  Get your keys at https://clerk.dev
- ❌ OpenAI API
  Get your API key at https://platform.openai.com
- ❌ Cloudflare R2 Storage
  Set up R2 at https://developers.cloudflare.com/r2
- ❌ Database
  Using SQLite by default for development

## Available Pages

- `/` - Homepage
- `/demo` - Component showcase and testing
- `/api/health` - Service health check


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
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Database errors
```bash
# Reset database
rm prisma/dev.db
npx prisma db push
```

### Module not found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

## Next Steps

1. Visit `/demo` to explore components
2. Check `/api/health` for service status
3. Obtain API keys for full functionality
4. Read phase documentation in `/Docs/phases/`

---
Generated on: 8/21/2025, 7:06:28 AM
