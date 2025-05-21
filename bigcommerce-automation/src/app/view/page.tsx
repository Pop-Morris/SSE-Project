import Link from 'next/link';

async function getWorkflows() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/workflows`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function ViewWorkflowsPage() {
  const workflows = await getWorkflows();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black">Workflows</h1>
          <Link href="/workflows/create" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition">Create New Workflow</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No workflows found.</div>
          ) : (
            workflows.map((wf: any) => (
              <div key={wf.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2">
                <h2 className="text-lg font-bold text-black mb-1">{wf.name}</h2>
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