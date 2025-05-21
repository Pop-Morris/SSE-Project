'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Workflow {
  id: number;
  name: string;
  triggerEvent: string;
  conditionType: string;
  threshold: number;
  actionType: string;
  actionValue: string;
  createdAt: string;
}

export default function ViewWorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch workflows on component mount
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/workflows');
      if (!response.ok) throw new Error('Failed to fetch workflows');
      const data = await response.json();
      setWorkflows(data);
    } catch (err) {
      setError('Failed to load workflows');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(`/api/workflows?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete workflow');

      // Remove the deleted workflow from the state
      setWorkflows(workflows.filter(wf => wf.id !== id));
    } catch (err) {
      console.error('Error deleting workflow:', err);
      alert('Failed to delete workflow');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black">Workflows</h1>
          <Link href="/workflows/create" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">
            Create New Workflow
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No workflows found.</div>
          ) : (
            workflows.map((wf) => (
              <div key={wf.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-black mb-1">{wf.name}</h2>
                  <button
                    onClick={() => handleDelete(wf.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete workflow"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">If</span> {wf.triggerEvent.replace('_', ' ')} is {wf.conditionType.replace('_', ' ')} <span className="font-mono">{wf.threshold}</span> <span className="font-semibold">then</span> {wf.actionType.replace('_', ' ')} <span className="font-mono">{wf.actionValue}</span>
                </div>
                <div className="text-xs text-gray-400 mt-auto">Created: {new Date(wf.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 