# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Improv Panic Button** is a web companion for Dungeon Masters that provides real-time AI-powered improvisation assistance during D&D sessions. DMs can upload campaign materials (PDFs, Word docs, markdown notes) and the system builds a Campaign Digest. During live play, DMs can hit "panic" prompts or type free-text to instantly receive lore-consistent NPCs, encounters, or plot redirects.

## Commands

### Initial Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize database with Prisma
npx prisma db push

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Development Commands
```bash
# Run development server (Next.js frontend + backend)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run tests in watch mode (for TDD)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Start production server
npm run start

# Check for vulnerabilities
npm audit

# Fix vulnerabilities (use with caution)
npm audit fix
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database (development only)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

## Architecture Overview

### Technology Stack
- **Frontend**: Next.js 14 (App Router) + Radix UI + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: SQLite + Turso + Prisma ORM
- **Vector DB**: Pinecone for campaign content embeddings
- **Auth**: Clerk.dev for user authentication
- **Payments**: Paddle for subscription management
- **File Storage**: Cloudflare R2 for document uploads
- **AI**: OpenAI GPT-4o-mini (128k context)
- **Hosting**: Vercel (frontend) + Railway (backend)
- **Real-time**: Server-Sent Events for live updates
- **State Management**: Zustand for client state
- **API Communication**: SWR + Upstash Redis for rate limiting

### Core User Flow
1. **Onboard & Upload**: DMs drag-and-drop campaign documents (DOCX/PDF/MD/TXT)
2. **Digest Creation**: AI processes documents into searchable Campaign Digest
3. **Session Prep**: DM flags relevant scenes for tonight's session (Active Context)
4. **Live Panic**: Radial menu provides 5 canned prompts during gameplay:
   - Generate NPC
   - Create Filler Encounter
   - Redirect Plot
   - Add Flavor Detail
   - Foreshadow Hook
5. **Log & Save**: All generated content saved to session notes for continuity

### Key Features
- **Token Budgeter**: Limits active context to 8k tokens (expandable to Deep Context in premium)
- **Encounter Scaler**: Uses Kobold Fight Club CR math for balanced encounters
- **Session Timer**: Free trial = single 5-hour block from first panic call
- **SRD Compliance**: Outputs limited to SRD content or user-provided text

### Project Structure
- `/src/app/` - Next.js 14 App Router pages and API routes
- `/src/components/` - React components organized by feature
- `/src/lib/` - Configuration for external services (Clerk, OpenAI, Pinecone, etc.)
- `/src/stores/` - Zustand state management stores
- `/src/types/` - TypeScript type definitions
- `/server/` - Express.js backend server code
- `/prisma/` - Database schema and migrations
- `/Docs/` - Project documentation and requirements

### Development Standards

#### File Organization
- **File Naming**: Use kebab-case for all files (`campaign-card.tsx`)
- **Max File Size**: No file exceeds 500 lines for AI tool compatibility
- **Documentation**: All files must have descriptive headers explaining their purpose
- **Function Documentation**: Use JSDoc/TSDoc comments for all functions with purpose and parameters
- **Testing**: Component tests alongside source files (`.test.tsx`)

#### Code Style and Structure
- **Programming Paradigm**: Use functional and declarative programming patterns; avoid classes
- **Components**: Functional components only with TypeScript interfaces
- **Functions**: Use `function` keyword for pure functions
- **Variable Naming**: Use descriptive names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- **Error Handling**: Throw errors instead of adding fallback values
- **Maps over Enums**: Avoid enums; use maps instead
- **Modularization**: Prefer iteration and modularization over code duplication
- **Conditionals**: Avoid unnecessary curly braces for simple statements

### Test-Driven Development (TDD) Workflow

Follow strict TDD methodology for all feature development using the RED/GREEN/REFACTOR cycle:

#### 🟥 RED Phase
1. Write a failing test for the next smallest unit of behavior
2. Do NOT write any implementation code yet
3. Explain what the test is verifying and why
4. Ensure the test clearly demonstrates task completion when it passes

#### 🟩 GREEN Phase
1. Implement the simplest code to make the test pass
2. Avoid overengineering or anticipating future needs
3. Confirm that all tests pass (existing + new)
4. Commit only after tests pass with message: `feat: implement [feature/behavior] to pass test`

#### 🛠 REFACTOR Phase
1. Plan improvements to code readability, structure, or performance
2. Update README with any necessary documentation
3. Do not change functionality during refactor
4. Return to RED phase for next feature

#### TDD Rules
- **No skipping steps**: Always follow RED → GREEN → REFACTOR
- **No test-first = no code**: Never write implementation without a failing test
- **Only commit on clean GREEN**: All tests must pass before committing
- **Tight, focused loops**: Solve one thing at a time, not multiple issues
- **Single test at a time**: Write and pass one test before moving to the next

### Phase 1 Implementation Status
Currently in Phase 1 (Foundation Setup) focusing on:
- Basic authentication with Clerk.dev
- File upload infrastructure with Cloudflare R2
- Database foundation with SQLite/Turso/Prisma
- AI integration proof of concept with OpenAI
- Basic UI framework with Next.js/Tailwind/Radix

### Important Conventions
- Always use absolute imports from `@/` for internal modules
- Implement proper loading and error states for all async operations
- Use Server Components by default, client components only when needed
- Follow mobile-first responsive design with Tailwind breakpoints
- Validate all user inputs and implement rate limiting on API endpoints

### Development Best Practices
- **Debugging**: Include useful debugging information in program output
- **File Editing**: Always read files before attempting to edit them
- **Security**: Run `npm audit` when vulnerabilities appear in terminal before proceeding
- **Version Control**: Always ask before using `--force` with git commands
- **Error Resolution**: When debugging, consider multiple potential causes for issues, not just the first hypothesis

## Custom Commands

### TDD Phase Execution Command
**Usage**: `/tdd-phase <phase-doc-filename>`

When this command is invoked with a phase planning document:

1. **Read Phase Document**: Load the specified phase planning document to understand the tasks
2. **Initialize Todo List**: Create a todo list from all TDD tasks in the document
3. **Execute TDD Cycle**: For each task:
   - Mark task as `in_progress`
   - **RED Phase**: Write failing test(s) for the current feature
   - **GREEN Phase**: Implement minimal code to pass the test(s)
   - **REFACTOR Phase**: Clean up code without changing functionality
   - Mark task as `completed` when all tests pass
4. **Document Refactoring**: After completing each task:
   - Add refactoring notes to `.cursor/scratchpad.md`
   - Commit changes with descriptive message
5. **Continue Until Done**: Repeat cycle for all tasks in the phase document
6. **Final Summary**: Report completion status and any blockers

**Example**:
```
User: /tdd-phase phase-1-foundation-setup.md
Claude: I'll begin executing the TDD tasks from phase-1-foundation-setup.md. Let me start by reading the document and creating a todo list...
```

**Automatic Actions**:
- Runs tests after each implementation
- Commits working code after each GREEN phase
- Documents refactoring decisions in scratchpad
- Reports progress throughout execution
- Handles test failures by staying in current phase until resolved