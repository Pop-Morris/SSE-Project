'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CreateWorkflow() {
  const [workflowName, setWorkflowName] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('new_order');
  const [conditionType, setConditionType] = useState('value_above');
  const [thresholdAmount, setThresholdAmount] = useState('');
  const [actionType, setActionType] = useState('add_note');
  const [actionNote, setActionNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/workflows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: workflowName,
        triggerEvent,
        conditionType,
        threshold: parseFloat(thresholdAmount),
        actionType,
        actionValue: actionType === 'add_note' ? actionNote : '',
      }),
    });
    if (res.ok) {
      // Optionally reset form or show success
      setWorkflowName('');
      setThresholdAmount('');
      setActionNote('');
      // You could also show a success message or redirect
    } else {
      // Handle error (show a message, etc.)
      alert('Failed to create workflow');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-black">Create New Workflow</h1>
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Workflow Name */}
            <div>
              <label htmlFor="workflowName" className="block text-sm font-medium text-gray-700 mb-1">
                Workflow Name
              </label>
              <input
                type="text"
                id="workflowName"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                placeholder="Example Name"
                required
              />
            </div>

            {/* Workflow Rule */}
            <div className="bg-gray-50 p-6 rounded-lg flex flex-wrap gap-x-4 gap-y-2 items-center">
              <span className="text-gray-700 font-medium">If</span>
              {/* Trigger Event Dropdown */}
              <select
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                className="rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-2 py-1"
              >
                <option value="new_order">a new order</option>
                {/* More trigger options will be added here */}
              </select>

              <span className="text-gray-700 font-medium">is</span>

              {/* Condition Type Dropdown */}
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value)}
                className="rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-2 py-1"
              >
                <option value="value_above">valued above</option>
                {/* More condition types will be added here */}
              </select>

              {/* Threshold Amount Input */}
              <input
                type="number"
                value={thresholdAmount}
                onChange={(e) => setThresholdAmount(e.target.value)}
                className="rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 w-32 text-black px-2 py-1"
                placeholder="499"
                min="0"
                step="0.01"
                required
              />

              <span className="text-gray-700 font-medium">then</span>

              {/* Action Type Dropdown */}
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black px-2 py-1"
              >
                <option value="add_note">add internal note</option>
                {/* More action types can be added here */}
              </select>

              {/* Action Value Input (only for add_note) */}
              {actionType === 'add_note' && (
                <input
                  type="text"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="rounded-md border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500 flex-1 text-black px-2 py-1 min-w-[150px]"
                  placeholder="VIP Customer"
                  required
                />
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Workflow
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 