'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { checkEnvironment } from '@/lib/config/env-check';
import { generateMockResponse, PanicType } from '@/lib/mock/mock-ai';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { showToast } = useToast();
  const config = checkEnvironment();
  
  const handlePanicButton = async (type: PanicType) => {
    setLoading(true);
    try {
      const result = await generateMockResponse(type);
      setResponse(result.content);
      showToast({
        title: 'Generated!',
        description: `Used ${result.tokens} tokens`,
        variant: 'success'
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to generate response',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Demo Dashboard</h1>
      
      {/* Environment Status */}
      <section className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Status</h2>
        <div className="space-y-2">
          <StatusItem 
            label="Mock Mode" 
            value={config.mockMode ? 'Enabled' : 'Disabled'} 
            status={config.mockMode} 
          />
          <StatusItem 
            label="Clerk Auth" 
            value={config.clerk.message} 
            status={config.clerk.configured} 
          />
          <StatusItem 
            label="OpenAI" 
            value={config.openai.message} 
            status={config.openai.configured} 
          />
          <StatusItem 
            label="Storage" 
            value={config.r2.message} 
            status={config.r2.configured} 
          />
          <StatusItem 
            label="Database" 
            value={config.database.message} 
            status={config.database.configured} 
          />
        </div>
      </section>
      
      {/* Component Showcase */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Component Showcase</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buttons */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-3">Buttons</h3>
            <div className="space-x-2">
              <Button>Default</Button>
              <Button variant="panic">Panic</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          
          {/* Loading States */}
          <div className="p-4 border rounded">
            <h3 className="font-semibold mb-3">Loading States</h3>
            <LoadingSpinner text="Loading..." />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
      </section>
      
      {/* Panic Button Demo */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Panic Button Demo</h2>
        <div className="space-x-2 mb-4">
          <Button 
            onClick={() => handlePanicButton('npc')} 
            disabled={loading}
          >
            Generate NPC
          </Button>
          <Button 
            onClick={() => handlePanicButton('encounter')} 
            disabled={loading}
          >
            Create Encounter
          </Button>
          <Button 
            onClick={() => handlePanicButton('plot')} 
            disabled={loading}
          >
            Redirect Plot
          </Button>
        </div>
        
        {loading && <LoadingSpinner text="Generating..." />}
        
        {response && !loading && (
          <div className="p-4 bg-amber-50 rounded mt-4">
            <div dangerouslySetInnerHTML={{ 
              __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            }} />
          </div>
        )}
      </section>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  value: string;
  status: boolean;
}

function StatusItem({ label, value, status }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium">{label}:</span>
      <span className={status ? 'text-green-600' : 'text-gray-500'}>
        {status ? '✓ ' : '○ '}{value}
      </span>
    </div>
  );
}