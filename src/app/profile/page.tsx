import { currentUser } from '@clerk/nextjs';

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Profile</h1>
      <p>{user.emailAddresses[0]?.emailAddress}</p>
      {user.firstName && <p>{user.firstName}</p>}
    </div>
  );
}
