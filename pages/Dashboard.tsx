
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { AlertCircle, CheckCircle, Clock, Calendar, FileWarning, ArrowRight } from 'lucide-react';
import { Vendor, RiskLevel, VendorStatus } from '../types';
import { MOCK_CONTRACTS } from '../constants';

interface DashboardProps {
  vendors: Vendor[];
}

const Dashboard: React.FC<DashboardProps> = ({ vendors }) => {
  // Compute Stats
  const totalVendors = vendors.length;
  const criticalVendors = vendors.filter(v => v.riskLevel === RiskLevel.CRITICAL).length;
  const highRiskVendors = vendors.filter(v => v.riskLevel === RiskLevel.HIGH).length;
  const onboardingVendors = vendors.filter(v => v.status === VendorStatus.ONBOARDING).length;

  // Alert Logic
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const expiringContracts = MOCK_CONTRACTS.filter(c => {
    const endDate = new Date(c.endDate);
    return c.status === 'ACTIVE' && endDate <= thirtyDaysFromNow;
  });

  const dueAssessments = vendors.filter(v => {
    const nextDate = new Date(v.nextAssessmentDate);
    return nextDate <= thirtyDaysFromNow;
  });

  const riskData = [
    { name: 'Low', value: vendors.filter(v => v.riskLevel === RiskLevel.LOW).length, color: '#10b981' },
    { name: 'Medium', value: vendors.filter(v => v.riskLevel === RiskLevel.MEDIUM).length, color: '#eab308' },
    { name: 'High', value: highRiskVendors, color: '#f97316' },
    { name: 'Critical', value: criticalVendors, color: '#ef4444' },
  ];

  const categoryData = vendors.reduce((acc: any[], curr) => {
    const existing = acc.find(i => i.name === curr.category);
    if (existing) existing.value++;
    else acc.push({ name: curr.category, value: 1 });
    return acc;
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Executive Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of third-party ecosystem health</p>
      </div>
      
      {/* Alert Center Widget */}
      {(expiringContracts.length > 0 || dueAssessments.length > 0) && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-start gap-4 z-10 relative">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg shrink-0">
               <AlertCircle size={24} />
            </div>
            <div className="flex-1">
               <h3 className="text-lg font-bold text-slate-800 mb-2">Action Required</h3>
               <div className="flex flex-col md:flex-row gap-6">
                 {expiringContracts.length > 0 && (
                   <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <FileWarning size={16} className="text-orange-500" />
                        Contracts Expiring Soon ({expiringContracts.length})
                      </p>
                      <ul className="space-y-1">
                        {expiringContracts.map(c => (
                          <li key={c.id} className="text-xs text-slate-600 bg-white/60 p-2 rounded border border-orange-100 flex justify-between">
                            <span>{c.title}</span>
                            <span className="font-mono text-orange-700">{c.endDate}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                 )}
                 {dueAssessments.length > 0 && (
                   <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-orange-500" />
                        Annual Assessments Due ({dueAssessments.length})
                      </p>
                      <ul className="space-y-1">
                        {dueAssessments.map(v => (
                          <li key={v.id} className="text-xs text-slate-600 bg-white/60 p-2 rounded border border-orange-100 flex justify-between">
                            <span>{v.name}</span>
                            <span className="font-mono text-orange-700">{v.nextAssessmentDate}</span>
                          </li>
                        ))}
                      </ul>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase">Total Vendors</p>
               <h2 className="text-3xl font-bold text-slate-800 mt-2">{totalVendors}</h2>
             </div>
             <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
               <CheckCircle size={20} />
             </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase">Critical Risks</p>
               <h2 className="text-3xl font-bold text-red-600 mt-2">{criticalVendors}</h2>
             </div>
             <div className="p-2 bg-red-100 rounded-lg text-red-600">
               <AlertCircle size={20} />
             </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase">High Risks</p>
               <h2 className="text-3xl font-bold text-orange-500 mt-2">{highRiskVendors}</h2>
             </div>
             <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
               <AlertCircle size={20} />
             </div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-semibold text-slate-500 uppercase">Onboarding</p>
               <h2 className="text-3xl font-bold text-blue-600 mt-2">{onboardingVendors}</h2>
             </div>
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
               <Clock size={20} />
             </div>
           </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {riskData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-xs text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Vendors by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
