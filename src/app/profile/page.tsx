import { auth, clerkClient } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) return <div>Not authenticated</div>;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  return (
    <div>
      <h1>Profile</h1>
      <p>{user.emailAddresses[0]?.emailAddress}</p>
      {user.firstName && <p>{user.firstName}</p>}
    </div>
  );
}
