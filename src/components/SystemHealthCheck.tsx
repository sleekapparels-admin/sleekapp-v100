import React, { useState } from 'react';
import { runAllDiagnostics } from '@/lib/diagnostics';

interface HealthCheckResult {
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: Record<string, unknown> | string;
  fix?: string;
}

interface SystemHealthCheckProps {
  isOpen: boolean;
  onClose: () => void;
}

const SystemHealthCheck = ({ isOpen, onClose }: SystemHealthCheckProps) => {
  const [results, setResults] = useState<Record<string, HealthCheckResult>>({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const healthData = await runAllDiagnostics();
      setResults(healthData);
      generateReport(healthData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Diagnostics failed:', error);
      setResults({
        general: {
          status: 'error',
          message: 'Failed to run diagnostics',
          details: errorMessage,
          fix: 'Check console for details or contact support.'
        }
      });
    }
    setLoading(false);
  };

  const generateReport = (data: Record<string, HealthCheckResult>) => {
    let markdown = '# System Health Check Report\n\n';
    Object.entries(data).forEach(([key, result]) => {
      const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      markdown += `${icon} **${key}**: ${result.message}\n`;
      if (result.details) markdown += `   - Details: ${JSON.stringify(result.details)}\n`;
      if (result.fix) markdown += `   - Fix: ${result.fix}\n`;
      markdown += '\n';
    });
    setReport(markdown);
  };

  const copyReport = () => {
    navigator.clipboard.writeText(report);
    alert('Report copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">System Health Check</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
        >
          {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
        </button>
        <div className="space-y-2">
          {Object.entries(results).map(([key, result]) => (
            <div key={key} className="flex items-start space-x-2">
              <span className={`text-lg ${result.status === 'success' ? 'text-green-500' : result.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>
                {result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'}
              </span>
              <div>
                <strong>{key}:</strong> {result.message}
                {result.details && <div className="text-sm text-gray-600">Details: {JSON.stringify(result.details)}</div>}
                {result.fix && <div className="text-sm text-blue-600">Fix: {result.fix}</div>}
              </div>
            </div>
          ))}
        </div>
        {report && (
          <div className="mt-4">
            <button onClick={copyReport} className="bg-green-500 text-white px-4 py-2 rounded">
              Copy Diagnostic Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemHealthCheck;