import React, { useState } from 'react';
import { Check, X, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import { ApprovalRequest } from '../types';

interface ApprovalsProps {
  requests: ApprovalRequest[];
}

const ApprovalsPage: React.FC<ApprovalsProps> = ({ requests: initialRequests }) => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    
    // Simulate API Call
    setTimeout(() => {
      setRequests((prev) => prev.filter(req => req.id !== id));
      setProcessingId(null);
      // In a real app, you would show a Toast notification here
      alert("Request Approved Successfully");
    }, 1500);
  };

  const handleReject = (id: string) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (reason === null) return; // User cancelled

    setProcessingId(id);

    // Simulate API Call
    setTimeout(() => {
      setRequests((prev) => prev.filter(req => req.id !== id));
      setProcessingId(null);
      console.log(`Rejected request ${id}. Reason: ${reason}`);
      alert("Request Rejected");
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Approval Queue</h1>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
          {requests.length} Pending
        </span>
      </div>
      <p className="text-slate-500 mb-8">Review and act on pending vendor actions.</p>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed animate-in fade-in zoom-in duration-300">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
               <Check className="text-green-500 w-8 h-8" />
             </div>
             <p className="text-slate-800 font-semibold text-lg">You're all caught up!</p>
             <p className="text-slate-500">No pending approvals found at this moment.</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                   <h3 className="font-semibold text-slate-900">{req.vendorName}</h3>
                   <div className="flex items-center gap-2 mt-1 mb-2">
                     <span className="text-xs font-bold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{req.step}</span>
                     <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {req.requestedAt}</span>
                   </div>
                   <p className="text-sm text-slate-600">{req.details}</p>
                   <p className="text-xs text-slate-400 mt-1">Requested by: <span className="font-medium text-slate-600">{req.requesterName}</span></p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button 
                  onClick={() => handleReject(req.id)}
                  disabled={processingId === req.id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                >
                  {processingId === req.id ? <Loader2 className="animate-spin" size={16}/> : <X size={16} />}
                  Reject
                </button>
                <button 
                  onClick={() => handleApprove(req.id)}
                  disabled={processingId === req.id}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:bg-indigo-400"
                >
                  {processingId === req.id ? <Loader2 className="animate-spin" size={16}/> : <Check size={16} />}
                  Approve
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;