import { prisma } from '@/lib/database';

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

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}