
import React from 'react';
import { Search, Download } from 'lucide-react';
import { AuditLog } from '../types';
import { exportToCSV } from '../utils/export';

interface ActivityLogsProps {
  logs: AuditLog[];
}

const ActivityLogsPage: React.FC<ActivityLogsProps> = ({ logs }) => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-6">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">System Audit Logs</h1>
            <p className="text-slate-500 mt-1">Track all user activities and data access.</p>
         </div>
         <div className="flex gap-4">
             <button 
                onClick={() => exportToCSV(logs, 'audit_logs')}
                className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
             >
                <Download size={16} />
                Export CSV
             </button>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter logs..." 
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-500 text-xs">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{log.userName}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{log.userRole}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                       log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                       log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                       log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                       'bg-gray-100 text-gray-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {log.resourceType} <span className="text-slate-400 text-xs">#{log.resourceId}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{log.meta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
