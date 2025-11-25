import React, { useState } from 'react';
import { Save, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { RiskCriteria } from '../types';

interface RiskCriteriaProps {
  criteria: RiskCriteria[];
}

const RiskCriteriaPage: React.FC<RiskCriteriaProps> = ({ criteria: initialCriteria }) => {
  const [criteria, setCriteria] = useState(initialCriteria);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<RiskCriteria>>({});

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleEdit = (c: RiskCriteria) => {
    setEditingId(c.id);
    setEditForm(c);
  };

  const handleAdd = () => {
    const newId = `rc_${Date.now()}`;
    const newCriteria: RiskCriteria = {
      id: newId,
      key: `new_criteria_${Date.now()}`,
      label: 'New Criteria',
      description: 'Description here',
      weight: 0,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setCriteria([...criteria, newCriteria]);
    // Immediately enter edit mode
    setEditingId(newId);
    setEditForm(newCriteria);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this risk criteria? This will affect future scorings.")) {
      setCriteria(criteria.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (editingId && editForm) {
      setCriteria(criteria.map(c => c.id === editingId ? { ...c, ...editForm } as RiskCriteria : c));
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.name === 'weight' ? parseInt(e.target.value) || 0 : e.target.value });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Risk Criteria Configuration</h1>
          <p className="text-slate-500 mt-1">Manage scoring weights and risk factors.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Add Criteria
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                 <tr>
                   <th className="px-6 py-4">Criteria Name</th>
                   <th className="px-6 py-4">Description</th>
                   <th className="px-6 py-4 w-32">Weight (%)</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {criteria.map((c) => (
                   <tr key={c.id} className="hover:bg-slate-50 group">
                     {editingId === c.id ? (
                       <>
                         <td className="px-6 py-4">
                           <input name="label" value={editForm.label} onChange={handleChange} className="border border-indigo-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
                         </td>
                         <td className="px-6 py-4">
                           <input name="description" value={editForm.description} onChange={handleChange} className="border border-indigo-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                         </td>
                         <td className="px-6 py-4">
                           <input name="weight" type="number" value={editForm.weight} onChange={handleChange} className="border border-indigo-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button onClick={handleSave} className="bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded mr-2 transition-colors"><Save size={16} /></button>
                         </td>
                       </>
                     ) : (
                       <>
                         <td className="px-6 py-4 font-medium text-slate-800">{c.label}</td>
                         <td className="px-6 py-4 text-slate-500">{c.description}</td>
                         <td className="px-6 py-4">
                           <span className="inline-block bg-slate-100 px-2 py-1 rounded text-xs font-mono font-semibold text-slate-600">{c.weight}%</span>
                         </td>
                         <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleEdit(c)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded mr-1 transition-colors"><Edit2 size={16} /></button>
                           <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                         </td>
                       </>
                     )}
                   </tr>
                 ))}
               </tbody>
             </table>
             {criteria.length === 0 && (
                <div className="p-8 text-center text-slate-400">
                   No risk criteria defined. Click "Add Criteria" to begin.
                </div>
             )}
           </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h3 className="font-semibold text-slate-800 mb-4">Weight Distribution</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-500">Total Weight Allocation</span>
              <span className={`text-lg font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-orange-500'}`}>{totalWeight}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 mb-4 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${totalWeight === 100 ? 'bg-green-500' : totalWeight > 100 ? 'bg-red-500' : 'bg-orange-500'}`} 
                style={{ width: `${Math.min(totalWeight, 100)}%` }}
              ></div>
            </div>
            
            {totalWeight !== 100 && (
               <div className={`flex items-start gap-2 p-3 rounded-lg text-sm border ${totalWeight > 100 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{totalWeight > 100 ? "Total weight exceeds 100%. Please reduce weights." : "Total weight must equal 100% for accurate scoring."}</p>
               </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Simulation Rule</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scores are calculated as <code>Σ (Rating × Weight)</code>. Ensure weights reflect current enterprise priorities. Changes affect real-time scoring immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCriteriaPage;