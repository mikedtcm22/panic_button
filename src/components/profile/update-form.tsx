'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export function ProfileUpdateForm() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update user profile through Clerk API
    await user?.update({ firstName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium">
          First Name
        </label>
        <input
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Save
      </button>
    </form>
  );
}
