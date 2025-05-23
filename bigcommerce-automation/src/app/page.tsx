import { getStoreInfo } from '@/lib/bigcommerce';
import Link from 'next/link';

export default async function Home() {
  let store: any = null;
  let error: string | null = null;
  try {
    store = await getStoreInfo();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl text-black font-bold">BigCommerce Automation</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl text-black font-bold mb-4">Welcome to Your Automation Platform</h2>

          {/* Store Info */}
          <div className="mb-6">
            {store ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded mb-2">
                <span className="font-bold text-black mb-2">Connected to:</span>
                <span className="font-bold text-black ml-2">{store.name}</span>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded mb-2">
                <span className="font-semibold text-red-700">Error:</span> {error}
              </div>
            ) : null}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/workflows/create"
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-bold text-black mb-2">Create Workflow</h3>
              <p className="text-sm text-gray-600">Set up a new automation workflow</p>
            </Link>
            <Link
              href="/view"
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-bold text-black mb-2">View Workflows</h3>
              <p className="text-sm text-gray-600">Manage your existing workflows</p>
            </Link>
            <Link
              href="/monitor"
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-bold text-black mb-2">Activity Log</h3>
              <p className="text-sm text-gray-600">Monitor workflow executions</p>
            </Link>
          </div>

          {/* Getting Started */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-black mb-4">Getting Started</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">1</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">Create your first workflow by clicking the "Create Workflow" card above</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">2</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">Configure triggers and actions for your workflow</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">3</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-700">Test and activate your workflow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
