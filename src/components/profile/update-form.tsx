'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';

export function ProfileUpdateForm() {
  const { user, update } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update({ firstName });
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
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
      >
        Save
      </button>
    </form>
  );
}