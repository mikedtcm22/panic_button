'use client';

import { useSignUp } from '@clerk/nextjs';
import { useState } from 'react';

export function SignUpForm() {
  const { signUp } = useSignUp();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    await signUp?.create({ 
      emailAddress: email, 
      password 
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input 
          id="email" 
          name="email" 
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
        )}
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input 
          id="password" 
          name="password" 
          type="password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.password && (
          <span className="text-red-500 text-sm mt-1 block">{errors.password}</span>
        )}
      </div>
      
      <button 
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
      >
        Sign Up
      </button>
    </form>
  );
}