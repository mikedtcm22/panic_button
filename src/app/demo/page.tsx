'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner, Skeleton } from '@/components/ui/loading';
import { checkEnvironment } from '@/lib/config/env-check';
import { generateMockResponse, PanicType } from '@/lib/mock/mock-ai';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const config = checkEnvironment();

  const handlePanicButton = async (type: PanicType) => {
    setLoading(true);
    setMessage('');
    try {
      const result = await generateMockResponse(type);
      setResponse(result.content);
      setMessage(`Generated! Used ${result.tokens} tokens`);
    } catch (error) {
      setMessage('Failed to generate response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Demo Dashboard</h1>

      {/* Environment Status */}
      <section className="mb-8 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Environment Status</h2>
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
          <StatusItem label="Storage" value={config.r2.message} status={config.r2.configured} />
          <StatusItem
            label="Database"
            value={config.database.message}
            status={config.database.configured}
          />
        </div>
      </section>

      {/* Component Showcase */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Component Showcase</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Buttons */}
          <div className="rounded border p-4">
            <h3 className="mb-3 font-semibold">Buttons</h3>
            <div className="space-x-2">
              <Button>Default</Button>
              <Button variant="panic">Panic</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          {/* Loading States */}
          <div className="rounded border p-4">
            <h3 className="mb-3 font-semibold">Loading States</h3>
            <LoadingSpinner text="Loading..." />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
      </section>

      {/* Panic Button Demo */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Panic Button Demo</h2>
        <div className="mb-4 space-x-2">
          <Button onClick={() => handlePanicButton('npc')} disabled={loading}>
            Generate NPC
          </Button>
          <Button onClick={() => handlePanicButton('encounter')} disabled={loading}>
            Create Encounter
          </Button>
          <Button onClick={() => handlePanicButton('plot')} disabled={loading}>
            Redirect Plot
          </Button>
        </div>

        {loading && <LoadingSpinner text="Generating..." />}

        {message && !loading && <div className="mb-2 text-sm text-green-600">{message}</div>}

        {response && !loading && (
          <div className="mt-4 rounded bg-amber-50 p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
              }}
            />
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
        {status ? '✓ ' : '○ '}
        {value}
      </span>
    </div>
  );
}
