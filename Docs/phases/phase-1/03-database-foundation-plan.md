# Phase 1: Database Foundation - TDD Implementation Plan

## Overview
This document provides a detailed TDD-driven implementation plan for the database foundation using SQLite, Turso, and Prisma ORM, following the RED/GREEN/REFACTOR cycle for each feature.

## Prerequisites
- Node.js and npm installed
- TypeScript configured
- Testing framework set up

## Implementation Steps

### Step 1: Database Configuration

#### 🟥 RED Phase - Test 1.1: Database Configuration Validation
```typescript
// src/lib/database/config.test.ts
describe('Database Configuration', () => {
  it('should validate required database environment variables', () => {
    const config = getDatabaseConfig();
    expect(config.databaseUrl).toBeDefined();
    expect(config.authToken).toBeDefined();
  });
  
  it('should throw error when environment variables are missing', () => {
    process.env.DATABASE_URL = '';
    expect(() => getDatabaseConfig()).toThrow('Missing database configuration');
  });
});
```
**Purpose**: Ensures database connection is properly configured with Turso credentials.

#### 🟩 GREEN Phase - Implementation 1.1
```typescript
// src/lib/database/config.ts
export function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  
  if (!databaseUrl || !authToken) {
    throw new Error('Missing database configuration');
  }
  
  return { databaseUrl, authToken };
}
```

#### 🟥 RED Phase - Test 1.2: Prisma Client Initialization
```typescript
// src/lib/database/prisma.test.ts
describe('Prisma Client', () => {
  it('should create a singleton Prisma client instance', () => {
    const client1 = getPrismaClient();
    const client2 = getPrismaClient();
    expect(client1).toBe(client2);
  });
  
  it('should connect to database successfully', async () => {
    const client = getPrismaClient();
    await expect(client.$connect()).resolves.not.toThrow();
  });
});
```

#### 🟩 GREEN Phase - Implementation 1.2
```typescript
// src/lib/database/prisma.ts
import { PrismaClient } from '@prisma/client';
import { getDatabaseConfig } from './config';

let prismaClient: PrismaClient | null = null;

export function getPrismaClient() {
  if (!prismaClient) {
    const config = getDatabaseConfig();
    
    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: config.databaseUrl,
        },
      },
    });
  }
  
  return prismaClient;
}

export const prisma = getPrismaClient();
```

### Step 2: Prisma Schema Definition

#### 🟥 RED Phase - Test 2.1: User Model
```typescript
// src/lib/database/models/user.test.ts
describe('User Model', () => {
  it('should create a new user with required fields', async () => {
    const userData = {
      id: 'user_123',
      email: 'test@example.com',
      clerkId: 'clerk_123',
    };
    
    const user = await createUser(userData);
    
    expect(user.id).toBe(userData.id);
    expect(user.email).toBe(userData.email);
    expect(user.clerkId).toBe(userData.clerkId);
    expect(user.createdAt).toBeInstanceOf(Date);
  });
  
  it('should enforce unique email constraint', async () => {
    const userData = {
      id: 'user_1',
      email: 'duplicate@example.com',
      clerkId: 'clerk_1',
    };
    
    await createUser(userData);
    
    await expect(createUser({
      ...userData,
      id: 'user_2',
      clerkId: 'clerk_2',
    })).rejects.toThrow(/unique constraint/i);
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.1
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  clerkId   String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  campaigns Campaign[]
  files     File[]
  sessions  Session[]
}
```

```typescript
// src/lib/database/models/user.ts
import { prisma } from '../prisma';

interface CreateUserData {
  id?: string;
  email: string;
  clerkId: string;
}

export async function createUser(data: CreateUserData) {
  return await prisma.user.create({
    data: {
      id: data.id,
      email: data.email,
      clerkId: data.clerkId,
    },
  });
}
```

#### 🟥 RED Phase - Test 2.2: Campaign Model
```typescript
// src/lib/database/models/campaign.test.ts
describe('Campaign Model', () => {
  it('should create a campaign with user association', async () => {
    const user = await createUser({
      email: 'test@example.com',
      clerkId: 'clerk_123',
    });
    
    const campaignData = {
      title: 'Dragon Heist',
      description: 'A thrilling urban adventure',
      userId: user.id,
    };
    
    const campaign = await createCampaign(campaignData);
    
    expect(campaign.title).toBe(campaignData.title);
    expect(campaign.description).toBe(campaignData.description);
    expect(campaign.userId).toBe(user.id);
  });
  
  it('should cascade delete when user is deleted', async () => {
    const user = await createUser({
      email: 'test@example.com',
      clerkId: 'clerk_123',
    });
    
    const campaign = await createCampaign({
      title: 'Test Campaign',
      userId: user.id,
    });
    
    await deleteUser(user.id);
    
    const foundCampaign = await getCampaign(campaign.id);
    expect(foundCampaign).toBeNull();
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.2
```prisma
// prisma/schema.prisma (addition)
model Campaign {
  id          String    @id @default(cuid())
  title       String
  description String?
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  files       File[]
  sessions    Session[]
  digest      Json?
}
```

```typescript
// src/lib/database/models/campaign.ts
import { prisma } from '../prisma';

interface CreateCampaignData {
  title: string;
  description?: string;
  userId: string;
}

export async function createCampaign(data: CreateCampaignData) {
  return await prisma.campaign.create({
    data: {
      title: data.title,
      description: data.description,
      userId: data.userId,
    },
  });
}

export async function getCampaign(id: string) {
  return await prisma.campaign.findUnique({
    where: { id },
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
```

#### 🟥 RED Phase - Test 2.3: File Model
```typescript
// src/lib/database/models/file.test.ts
describe('File Model', () => {
  it('should create file with campaign association', async () => {
    const user = await createUser({
      email: 'test@example.com',
      clerkId: 'clerk_123',
    });
    
    const campaign = await createCampaign({
      title: 'Test Campaign',
      userId: user.id,
    });
    
    const fileData = {
      fileName: 'adventure.pdf',
      fileType: 'application/pdf',
      fileSize: 1024000,
      storageKey: 'user_123/campaigns/abc/adventure.pdf',
      userId: user.id,
      campaignId: campaign.id,
    };
    
    const file = await createFile(fileData);
    
    expect(file.fileName).toBe(fileData.fileName);
    expect(file.campaignId).toBe(campaign.id);
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.3
```prisma
// prisma/schema.prisma (addition)
model File {
  id         String    @id @default(cuid())
  fileName   String
  fileType   String
  fileSize   Int
  storageKey String    @unique
  userId     String
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  campaignId String?
  campaign   Campaign? @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}
```

```typescript
// src/lib/database/models/file.ts
import { prisma } from '../prisma';

interface CreateFileData {
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  userId: string;
  campaignId?: string;
}

export async function createFile(data: CreateFileData) {
  return await prisma.file.create({
    data,
  });
}
```

#### 🟥 RED Phase - Test 2.4: Session Model
```typescript
// src/lib/database/models/session.test.ts
describe('Session Model', () => {
  it('should create session with timer tracking', async () => {
    const user = await createUser({
      email: 'test@example.com',
      clerkId: 'clerk_123',
    });
    
    const campaign = await createCampaign({
      title: 'Test Campaign',
      userId: user.id,
    });
    
    const sessionData = {
      userId: user.id,
      campaignId: campaign.id,
      startTime: new Date(),
      isActive: true,
    };
    
    const session = await createSession(sessionData);
    
    expect(session.userId).toBe(user.id);
    expect(session.campaignId).toBe(campaign.id);
    expect(session.isActive).toBe(true);
    expect(session.startTime).toBeInstanceOf(Date);
  });
  
  it('should track panic calls in session', async () => {
    const session = await createSession({
      userId: 'user_123',
      campaignId: 'campaign_123',
    });
    
    const panicData = {
      sessionId: session.id,
      promptType: 'npc',
      response: 'Generated NPC content',
    };
    
    const panicCall = await createPanicCall(panicData);
    
    expect(panicCall.sessionId).toBe(session.id);
    expect(panicCall.promptType).toBe('npc');
  });
});
```

#### 🟩 GREEN Phase - Implementation 2.4
```prisma
// prisma/schema.prisma (addition)
model Session {
  id         String      @id @default(cuid())
  userId     String
  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  campaignId String
  campaign   Campaign    @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  startTime  DateTime    @default(now())
  endTime    DateTime?
  isActive   Boolean     @default(false)
  notes      String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  
  panicCalls PanicCall[]
}

model PanicCall {
  id         String   @id @default(cuid())
  sessionId  String
  session    Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  promptType String
  context    String?
  response   String
  tokens     Int?
  createdAt  DateTime @default(now())
}
```

```typescript
// src/lib/database/models/session.ts
import { prisma } from '../prisma';

interface CreateSessionData {
  userId: string;
  campaignId: string;
  startTime?: Date;
  isActive?: boolean;
}

export async function createSession(data: CreateSessionData) {
  return await prisma.session.create({
    data: {
      userId: data.userId,
      campaignId: data.campaignId,
      startTime: data.startTime,
      isActive: data.isActive ?? false,
    },
  });
}

interface CreatePanicCallData {
  sessionId: string;
  promptType: string;
  context?: string;
  response: string;
  tokens?: number;
}

export async function createPanicCall(data: CreatePanicCallData) {
  return await prisma.panicCall.create({
    data,
  });
}
```

### Step 3: Database Migrations

#### 🟥 RED Phase - Test 3.1: Migration Execution
```typescript
// src/lib/database/migrations.test.ts
describe('Database Migrations', () => {
  it('should run initial migration successfully', async () => {
    const result = await runMigration('init');
    expect(result.success).toBe(true);
    expect(result.migrationName).toContain('init');
  });
  
  it('should verify all tables are created', async () => {
    await runMigration('init');
    
    const tables = await getTableNames();
    expect(tables).toContain('User');
    expect(tables).toContain('Campaign');
    expect(tables).toContain('File');
    expect(tables).toContain('Session');
    expect(tables).toContain('PanicCall');
  });
});
```

#### 🟩 GREEN Phase - Implementation 3.1
```typescript
// src/lib/database/migrations.ts
import { execSync } from 'child_process';
import { prisma } from './prisma';

export async function runMigration(name: string) {
  try {
    const output = execSync(`npx prisma migrate dev --name ${name}`, {
      encoding: 'utf-8',
    });
    
    return {
      success: true,
      migrationName: name,
      output,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Migration failed',
    };
  }
}

export async function getTableNames() {
  const result = await prisma.$queryRaw<Array<{ name: string }>>`
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%'
  `;
  
  return result.map(row => row.name);
}
```

### Step 4: CRUD Operations

#### 🟥 RED Phase - Test 4.1: User CRUD Operations
```typescript
// src/lib/database/repositories/user-repository.test.ts
describe('User Repository', () => {
  it('should find user by email', async () => {
    const user = await createUser({
      email: 'find@example.com',
      clerkId: 'clerk_find',
    });
    
    const found = await findUserByEmail('find@example.com');
    expect(found?.id).toBe(user.id);
  });
  
  it('should update user profile', async () => {
    const user = await createUser({
      email: 'update@example.com',
      clerkId: 'clerk_update',
    });
    
    const updated = await updateUser(user.id, {
      email: 'newemail@example.com',
    });
    
    expect(updated.email).toBe('newemail@example.com');
  });
  
  it('should list all users with pagination', async () => {
    // Create multiple users
    for (let i = 0; i < 15; i++) {
      await createUser({
        email: `user${i}@example.com`,
        clerkId: `clerk_${i}`,
      });
    }
    
    const page1 = await listUsers({ page: 1, limit: 10 });
    expect(page1.users).toHaveLength(10);
    expect(page1.total).toBeGreaterThanOrEqual(15);
    
    const page2 = await listUsers({ page: 2, limit: 10 });
    expect(page2.users.length).toBeGreaterThan(0);
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.1
```typescript
// src/lib/database/repositories/user-repository.ts
import { prisma } from '../prisma';

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUser(id: string, data: { email?: string }) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

interface ListUsersOptions {
  page: number;
  limit: number;
}

export async function listUsers({ page, limit }: ListUsersOptions) {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);
  
  return { users, total };
}
```

#### 🟥 RED Phase - Test 4.2: Campaign CRUD Operations
```typescript
// src/lib/database/repositories/campaign-repository.test.ts
describe('Campaign Repository', () => {
  it('should list campaigns for a user', async () => {
    const user = await createUser({
      email: 'campaigns@example.com',
      clerkId: 'clerk_campaigns',
    });
    
    await createCampaign({ title: 'Campaign 1', userId: user.id });
    await createCampaign({ title: 'Campaign 2', userId: user.id });
    
    const campaigns = await listUserCampaigns(user.id);
    expect(campaigns).toHaveLength(2);
  });
  
  it('should update campaign with digest', async () => {
    const campaign = await createCampaign({
      title: 'Test Campaign',
      userId: 'user_123',
    });
    
    const digest = {
      npcs: ['NPC1', 'NPC2'],
      locations: ['Tavern', 'Castle'],
    };
    
    const updated = await updateCampaignDigest(campaign.id, digest);
    expect(updated.digest).toEqual(digest);
  });
  
  it('should delete campaign and associated files', async () => {
    const campaign = await createCampaign({
      title: 'Delete Test',
      userId: 'user_123',
    });
    
    await createFile({
      fileName: 'test.pdf',
      fileType: 'application/pdf',
      fileSize: 1000,
      storageKey: 'test-key',
      userId: 'user_123',
      campaignId: campaign.id,
    });
    
    await deleteCampaign(campaign.id);
    
    const files = await listCampaignFiles(campaign.id);
    expect(files).toHaveLength(0);
  });
});
```

#### 🟩 GREEN Phase - Implementation 4.2
```typescript
// src/lib/database/repositories/campaign-repository.ts
import { prisma } from '../prisma';

export async function listUserCampaigns(userId: string) {
  return await prisma.campaign.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function updateCampaignDigest(id: string, digest: any) {
  return await prisma.campaign.update({
    where: { id },
    data: { digest },
  });
}

export async function deleteCampaign(id: string) {
  return await prisma.campaign.delete({
    where: { id },
  });
}

export async function listCampaignFiles(campaignId: string) {
  return await prisma.file.findMany({
    where: { campaignId },
  });
}
```

### Step 5: Database Connection Management

#### 🟥 RED Phase - Test 5.1: Connection Pool
```typescript
// src/lib/database/connection.test.ts
describe('Database Connection Pool', () => {
  it('should handle concurrent connections', async () => {
    const promises = Array(10).fill(null).map(async () => {
      const user = await createUser({
        email: `concurrent${Math.random()}@example.com`,
        clerkId: `clerk_${Math.random()}`,
      });
      return user;
    });
    
    const results = await Promise.all(promises);
    expect(results).toHaveLength(10);
    expect(results.every(r => r.id)).toBe(true);
  });
  
  it('should retry on connection failure', async () => {
    let attempts = 0;
    const mockConnect = jest.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        throw new Error('Connection failed');
      }
      return Promise.resolve();
    });
    
    const result = await connectWithRetry(mockConnect, 3);
    expect(result).toBe(true);
    expect(attempts).toBe(3);
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.1
```typescript
// src/lib/database/connection.ts
import { prisma } from './prisma';

export async function connectWithRetry(
  connectFn: () => Promise<void>,
  maxAttempts: number = 3
): Promise<boolean> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      await connectFn();
      return true;
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        throw error;
      }
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
    }
  }
  
  return false;
}

export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { healthy: true };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Database unhealthy',
    };
  }
}
```

#### 🟥 RED Phase - Test 5.2: Database Seeding
```typescript
// src/lib/database/seed.test.ts
describe('Database Seeding', () => {
  it('should seed development data', async () => {
    await seedDatabase();
    
    const users = await prisma.user.count();
    expect(users).toBeGreaterThan(0);
    
    const campaigns = await prisma.campaign.count();
    expect(campaigns).toBeGreaterThan(0);
  });
  
  it('should be idempotent', async () => {
    await seedDatabase();
    const count1 = await prisma.user.count();
    
    await seedDatabase();
    const count2 = await prisma.user.count();
    
    expect(count1).toBe(count2);
  });
});
```

#### 🟩 GREEN Phase - Implementation 5.2
```typescript
// src/lib/database/seed.ts
import { prisma } from './prisma';

export async function seedDatabase() {
  // Check if already seeded
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Database already seeded');
    return;
  }
  
  // Create test users
  const testUser = await prisma.user.create({
    data: {
      email: 'dm@example.com',
      clerkId: 'clerk_test_dm',
    },
  });
  
  // Create test campaign
  const campaign = await prisma.campaign.create({
    data: {
      title: 'The Lost Mine of Phandelver',
      description: 'A classic D&D 5e starter adventure',
      userId: testUser.id,
    },
  });
  
  // Create test file
  await prisma.file.create({
    data: {
      fileName: 'adventure-notes.md',
      fileType: 'text/markdown',
      fileSize: 5000,
      storageKey: 'test/adventure-notes.md',
      userId: testUser.id,
      campaignId: campaign.id,
    },
  });
  
  console.log('Database seeded successfully');
}
```

## Testing Checklist

### Unit Tests
- [ ] Database configuration validation
- [ ] Prisma client singleton
- [ ] User model operations
- [ ] Campaign model operations
- [ ] File model operations
- [ ] Session model operations
- [ ] Migration execution
- [ ] CRUD operations for all models

### Integration Tests
- [ ] Database connection with retry
- [ ] Transaction support
- [ ] Cascade deletes
- [ ] Unique constraints
- [ ] Foreign key relationships
- [ ] Concurrent operations

### Performance Tests
- [ ] Query performance under load
- [ ] Connection pool management
- [ ] Large dataset operations
- [ ] Index effectiveness

## Success Metrics
- All unit tests passing (100% of database operations)
- Database operations complete within 100ms
- Zero data integrity issues
- Successful migration rollback and recovery
- Connection pool handles 100+ concurrent operations

## Next Steps
After completing all tests and implementations:
1. Run full test suite: `npm run test`
2. Check coverage: `npm run test:coverage`
3. Run migrations: `npx prisma migrate dev`
4. Commit with message: `feat: implement database foundation with Prisma and Turso`
5. Document database schema in project documentation
6. Create database backup and restore procedures