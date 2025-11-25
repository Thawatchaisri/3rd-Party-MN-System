

import React, { useState } from 'react';
import { 
  ArrowLeft, Globe, Mail, Shield, AlertTriangle, FileText, Database, Sparkles, Loader2,
  Calendar, Download, Plus, Trash2, Save, X, History, Edit2, Check
} from 'lucide-react';
import { Vendor, Contract, Incident, DataFlow, RiskLevel, VendorStatus } from '../types';
import RiskBadge from '../components/RiskBadge';
import { analyzeVendorRisk, AIAnalysisResult } from '../services/geminiService';
import { MOCK_ASSESSMENT_LOGS, MOCK_RISK_CRITERIA } from '../constants';
import { exportToCSV } from '../utils/export';

interface VendorDetailProps {
  vendor: Vendor;
  contracts: Contract[];
  incidents: Incident[];
  dataFlows: DataFlow[];
  onBack: () => void;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendor: initialVendor, contracts: initialContracts, incidents: initialIncidents, dataFlows: initialDataFlows, onBack }) => {
  const [vendor, setVendor] = useState(initialVendor);
  const [contracts, setContracts] = useState(initialContracts);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [dataFlows, setDataFlows] = useState(initialDataFlows);
  
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CONTRACTS' | 'RISK' | 'DATA' | 'HISTORY'>('OVERVIEW');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(vendor);

  // Modal States
  const [modalType, setModalType] = useState<'CONTRACT' | 'INCIDENT' | 'DATA' | 'ASSESSMENT' | null>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Assessment State
  const [assessmentScores, setAssessmentScores] = useState<Record<string, number>>({});

  // Check Expiry/Due Dates
  const today = new Date();
  const assessmentDate = new Date(vendor.nextAssessmentDate);
  const isAssessmentDue = assessmentDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeVendorRisk(vendor, contracts, incidents);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const handleTerminate = () => {
    if(confirm(`ARE YOU SURE?\n\nThis will terminate the relationship with ${vendor.name} and suspend all data flows immediately.\n\nType 'TERMINATE' to confirm.`)) {
        setVendor({...vendor, status: VendorStatus.TERMINATED});
        alert("Vendor status updated to TERMINATED.");
    }
  };

  // Edit Profile Handlers
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveProfileChanges = () => {
    setVendor(editForm);
    setIsEditing(false);
    alert("Vendor profile updated successfully.");
  };

  // Generic Form Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const newContract: Contract = {
      id: `c_${Date.now()}`,
      vendorId: vendor.id,
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      value: Number(formData.value),
      status: 'ACTIVE',
      slaLevel: formData.slaLevel || 'BRONZE',
      documentUrl: '#'
    };
    setContracts([...contracts, newContract]);
    setModalType(null);
    setFormData({});
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const newIncident: Incident = {
      id: `i_${Date.now()}`,
      vendorId: vendor.id,
      title: formData.title,
      severity: formData.severity,
      dateOccurred: formData.dateOccurred,
      status: 'OPEN',
      description: formData.description
    };
    setIncidents([newIncident, ...incidents]);
    setModalType(null);
    setFormData({});
    
    // Simulate email to admin
    console.log(`[EMAIL SENT] To: admin@company.com | Subject: New Incident Reported for ${vendor.name}`);
    alert("Incident reported. Risk team notified via email.");
  };

  const handleAddDataFlow = (e: React.FormEvent) => {
    e.preventDefault();
    const newFlow: DataFlow = {
      id: `d_${Date.now()}`,
      vendorId: vendor.id,
      direction: formData.direction,
      dataTypes: formData.dataTypes.split(',').map((s: string) => s.trim()),
      description: formData.description
    };
    setDataFlows([...dataFlows, newFlow]);
    setModalType(null);
    setFormData({});
  };

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate Score
    // Formula: Sum( (Rating / 5) * Weight )
    let totalScore = 0;
    MOCK_RISK_CRITERIA.forEach(criteria => {
      const rating = assessmentScores[criteria.id] || 0;
      const contribution = (rating / 5) * criteria.weight;
      totalScore += contribution;
    });

    const finalScore = Math.round(totalScore);

    // Determine Risk Level
    let level = RiskLevel.LOW;
    if (finalScore < 40) level = RiskLevel.CRITICAL;
    else if (finalScore < 60) level = RiskLevel.HIGH;
    else if (finalScore < 80) level = RiskLevel.MEDIUM;

    setVendor({
      ...vendor,
      riskScore: finalScore,
      riskLevel: level,
      nextAssessmentDate: new Date(today.setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0]
    });

    setModalType(null);
    setAssessmentScores({});
    alert(`Assessment Completed.\nNew Risk Score: ${finalScore}/100\nRisk Level: ${level}`);
  };

  const handleDelete = (type: string, id: string) => {
    if(!confirm("Delete this item?")) return;
    if(type === 'CONTRACT') setContracts(contracts.filter(c => c.id !== id));
    if(type === 'DATA') setDataFlows(dataFlows.filter(c => c.id !== id));
  };

  const assessmentHistory = MOCK_ASSESSMENT_LOGS.filter(l => l.vendorId === vendor.id);

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Vendors
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
              {vendor.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                 {isEditing ? (
                   <input 
                      name="name" 
                      value={editForm.name} 
                      onChange={handleEditChange}
                      className="text-xl font-bold border rounded px-2 py-1"
                   />
                 ) : (
                   <h1 className="text-2xl font-bold text-slate-900">{vendor.name}</h1>
                 )}
                 <button 
                  onClick={() => isEditing ? saveProfileChanges() : setIsEditing(true)}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                 >
                   {isEditing ? <Check className="text-green-600" size={20} /> : <Edit2 size={16} />}
                 </button>
                 {isEditing && (
                   <button onClick={() => { setIsEditing(false); setEditForm(vendor); }} className="text-red-400 hover:text-red-600">
                     <X size={20} />
                   </button>
                 )}
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe size={14} /> 
                  {isEditing ? (
                    <input name="website" value={editForm.website} onChange={handleEditChange} className="border rounded px-1" />
                  ) : (
                    <a href={vendor.website} className="hover:underline">{vendor.website}</a>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <Mail size={14} /> 
                  {isEditing ? (
                    <input name="email" value={editForm.email} onChange={handleEditChange} className="border rounded px-1" />
                  ) : (
                    vendor.email
                  )}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === VendorStatus.ACTIVE ? 'bg-blue-100 text-blue-800' :
                      (vendor.status === VendorStatus.SUSPENDED || vendor.status === VendorStatus.TERMINATED) ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {vendor.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-6 items-center">
             <div className={`text-right ${isAssessmentDue ? 'text-orange-600' : 'text-slate-500'}`}>
                <p className="text-xs uppercase tracking-wide font-semibold flex items-center gap-1 justify-end">
                   {isAssessmentDue && <AlertTriangle size={12} />} Next Assessment
                </p>
                <p className="font-mono font-medium">{vendor.nextAssessmentDate}</p>
             </div>
             <div className="border-l border-slate-200 pl-6 flex gap-3">
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Security Score</p>
                    <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-bold text-slate-800">{vendor.riskScore}</span>
                    <span className="text-sm text-slate-400">/100</span>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-center">
                    <RiskBadge level={vendor.riskLevel} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200 mb-6 overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Overview', icon: FileText },
          { id: 'CONTRACTS', label: 'Contracts', icon: FileText },
          { id: 'RISK', label: 'Risk & Incidents', icon: Shield },
          { id: 'DATA', label: 'Data Flows', icon: Database },
          { id: 'HISTORY', label: 'Assessment History', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Vendor Details</h3>
                {isEditing ? (
                  <textarea 
                    name="description" 
                    value={editForm.description} 
                    onChange={handleEditChange} 
                    className="w-full border rounded p-2 h-32"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed mb-4">{vendor.description}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                   <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-400 uppercase">Category</p>
                      {isEditing ? (
                        <input name="category" value={editForm.category} onChange={handleEditChange} className="border rounded px-1 w-full" />
                      ) : (
                        <p className="font-medium text-slate-700">{vendor.category}</p>
                      )}
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-400 uppercase">Contact Person</p>
                      {isEditing ? (
                        <input name="contactPerson" value={editForm.contactPerson} onChange={handleEditChange} className="border rounded px-1 w-full" />
                      ) : (
                        <p className="font-medium text-slate-700">{vendor.contactPerson}</p>
                      )}
                   </div>
                   <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-400 uppercase">Onboarded</p>
                      <p className="font-medium text-slate-700">{vendor.createdAt}</p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CONTRACTS' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700">Active Contracts</h3>
                  <div className="flex gap-2">
                     <button onClick={() => exportToCSV(contracts, 'contracts')} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors" title="Export CSV">
                        <Download size={18} />
                     </button>
                     <button onClick={() => setModalType('CONTRACT')} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-1">
                        <Plus size={14} /> Add
                     </button>
                  </div>
               </div>
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-6 py-3 font-medium text-slate-500">Title</th>
                     <th className="px-6 py-3 font-medium text-slate-50">SLA</th>
                     <th className="px-6 py-3 font-medium text-slate-500">Period</th>
                     <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                     <th className="px-6 py-3"></th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {contracts.map(c => {
                     const isExpiring = new Date(c.endDate) <= new Date(Date.now() + 30*24*60*60*1000);
                     return (
                     <tr key={c.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium text-indigo-600 flex items-center gap-2">
                         <FileText size={16} /> {c.title}
                       </td>
                       <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              c.slaLevel === 'GOLD' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              c.slaLevel === 'SILVER' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                              'bg-orange-50 text-orange-800 border-orange-200'
                          }`}>{c.slaLevel}</span>
                       </td>
                       <td className="px-6 py-4 text-slate-500">
                          {c.startDate} - <span className={isExpiring && c.status === 'ACTIVE' ? 'text-red-600 font-bold' : ''}>{c.endDate}</span>
                          {isExpiring && c.status === 'ACTIVE' && <AlertTriangle size={12} className="inline ml-1 text-red-500" />}
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded text-xs font-semibold ${
                           c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                           c.status === 'EXPIRED' ? 'bg-red-100 text-red-700' :
                           'bg-slate-100 text-slate-700'
                         }`}>{c.status}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete('CONTRACT', c.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                       </td>
                     </tr>
                   )})}
                   {contracts.length === 0 && (
                     <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No contracts found.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
            </div>
          )}

          {activeTab === 'RISK' && (
             <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div>
                        <p className="text-sm text-slate-500 font-medium">Risk Score</p>
                        <p className="text-3xl font-bold text-slate-800">{vendor.riskScore}</p>
                     </div>
                     <button 
                        onClick={() => setModalType('ASSESSMENT')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                     >
                        Conduct Assessment
                     </button>
                  </div>
                  <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <p className="text-sm text-slate-500 font-medium mb-1">Risk Level</p>
                     <RiskBadge level={vendor.riskLevel} />
                     <p className="text-xs text-slate-400 mt-2">Calculated from weighted criteria.</p>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={20} /> Reported Incidents
                    </h3>
                    <button onClick={() => setModalType('INCIDENT')} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 text-xs font-bold rounded-lg hover:bg-red-100 flex items-center gap-1">
                        <Plus size={14} /> Report Incident
                    </button>
                 </div>
                 
                 {incidents.length === 0 ? (
                   <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-100">
                     <p className="text-slate-500 text-sm">No incidents reported recently.</p>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     {incidents.map(inc => (
                       <div key={inc.id} className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                         <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-red-900">{inc.title}</h4>
                            <span className="text-xs text-red-700 font-mono">{inc.dateOccurred}</span>
                         </div>
                         <p className="text-sm text-red-800 mt-1">{inc.description}</p>
                         <div className="mt-3 flex gap-2">
                            <span className="px-2 py-0.5 bg-red-200 text-red-800 text-xs rounded font-medium">Severity: {inc.severity}</span>
                            <span className="px-2 py-0.5 bg-white text-slate-600 border border-slate-200 text-xs rounded font-medium">Status: {inc.status}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
             </div>
          )}

          {activeTab === 'DATA' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Database className="text-blue-500" size={20} /> Data Architecture
                  </h3>
                  <button onClick={() => setModalType('DATA')} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200 flex items-center gap-1">
                        <Plus size={14} /> Add Map
                  </button>
               </div>
               
               <div className="space-y-4">
                 {dataFlows.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-sm">No data flow mappings available.</div>
                 ) : (
                   dataFlows.map(df => (
                     <div key={df.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between group">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              df.direction === 'INBOUND' ? 'bg-blue-100 text-blue-700' :
                              df.direction === 'OUTBOUND' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {df.direction}
                            </span>
                          </div>
                          <p className="text-slate-600 text-sm">{df.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                            {df.dataTypes.map(dt => (
                              <span key={dt} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">{dt}</span>
                            ))}
                          </div>
                          <button onClick={() => handleDelete('DATA', df.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                        </div>
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700">Annual Assessment Logs</h3>
                  <button onClick={() => exportToCSV(assessmentHistory, 'assessments')} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                     <Download size={16} /> Download Report
                  </button>
               </div>
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-6 py-3 font-medium text-slate-500">Year</th>
                     <th className="px-6 py-3 font-medium text-slate-500">Date</th>
                     <th className="px-6 py-3 font-medium text-slate-500">Assessor</th>
                     <th className="px-6 py-3 font-medium text-slate-500">Score</th>
                     <th className="px-6 py-3 font-medium text-slate-500">Grade</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {assessmentHistory.map(log => (
                     <tr key={log.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-bold text-slate-700">{log.year}</td>
                       <td className="px-6 py-4 text-slate-600">{log.assessedAt}</td>
                       <td className="px-6 py-4 text-slate-600">{log.assessedBy}</td>
                       <td className="px-6 py-4 font-mono">{log.score}/100</td>
                       <td className="px-6 py-4">
                         <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                           log.grade === 'A' ? 'bg-green-100 text-green-700' : 
                           log.grade === 'B' ? 'bg-blue-100 text-blue-700' : 
                           log.grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                         }`}>{log.grade}</span>
                       </td>
                     </tr>
                   ))}
                   {assessmentHistory.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No assessment history found.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
            </div>
          )}

        </div>

        {/* Sidebar Actions / AI Analysis */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <Sparkles className="text-yellow-400" size={18} />
                AI Risk Analyst
              </h3>
              <p className="text-indigo-200 text-sm mb-4">
                Use Gemini to analyze contract values, past incidents, and profile data to detect hidden risks.
              </p>
              
              {!aiAnalysis && (
                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full bg-white text-indigo-900 font-semibold py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  {analyzing ? <Loader2 className="animate-spin" size={18} /> : <Shield size={18} />}
                  {analyzing ? 'Analyzing...' : 'Generate Risk Report'}
                </button>
              )}

              {aiAnalysis && (
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-bold uppercase text-indigo-300">Assessment</span>
                     <RiskBadge level={aiAnalysis.suggestedRiskLevel} />
                  </div>
                  <p className="text-sm leading-snug mb-3">{aiAnalysis.summary}</p>
                  
                  <p className="text-xs font-bold uppercase text-indigo-300 mb-1">Risk Factors</p>
                  <ul className="list-disc list-inside text-xs text-indigo-100 mb-3 space-y-1">
                    {aiAnalysis.riskFactors.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>

                  <p className="text-xs font-bold uppercase text-indigo-300 mb-1">Recommendation</p>
                  <p className="text-xs text-white font-medium italic">"{aiAnalysis.recommendation}"</p>
                  
                  <button 
                    onClick={() => setAiAnalysis(null)} 
                    className="mt-4 text-xs text-indigo-300 hover:text-white w-full text-center underline"
                  >
                    Reset Analysis
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setModalType('CONTRACT')}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group"
              >
                Create New Contract
                <span className="opacity-0 group-hover:opacity-100 text-slate-400">→</span>
              </button>
              <button 
                onClick={() => setModalType('INCIDENT')}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-all flex items-center justify-between group"
              >
                Report Incident
                <span className="opacity-0 group-hover:opacity-100 text-slate-400">→</span>
              </button>
              <button 
                onClick={handleTerminate}
                disabled={vendor.status === VendorStatus.TERMINATED}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {vendor.status === VendorStatus.TERMINATED ? 'Vendor Terminated' : 'Terminate Vendor'}
                <span className="opacity-0 group-hover:opacity-100 text-red-400">!</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800">
                 {modalType === 'CONTRACT' ? 'New Contract' : modalType === 'INCIDENT' ? 'Report Incident' : modalType === 'DATA' ? 'Data Flow Map' : 'Risk Assessment'}
               </h3>
               <button onClick={() => setModalType(null)} className="p-1 hover:bg-slate-200 rounded-full"><X size={18} /></button>
             </div>
             
             <div className="overflow-y-auto p-6">
                <form onSubmit={modalType === 'CONTRACT' ? handleCreateContract : modalType === 'INCIDENT' ? handleReportIncident : modalType === 'DATA' ? handleAddDataFlow : handleSubmitAssessment} className="space-y-4">
                  
                  {modalType === 'CONTRACT' && (
                    <>
                      <input name="title" required placeholder="Contract Title" className="w-full p-2 border rounded" onChange={handleInputChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <input name="startDate" type="date" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                        <input name="endDate" type="date" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                      </div>
                      <input name="value" type="number" required placeholder="Value (USD)" className="w-full p-2 border rounded" onChange={handleInputChange} />
                      <select name="slaLevel" className="w-full p-2 border rounded" onChange={handleInputChange}>
                        <option value="BRONZE">SLA: Bronze</option>
                        <option value="SILVER">SLA: Silver</option>
                        <option value="GOLD">SLA: Gold</option>
                      </select>
                    </>
                  )}

                  {modalType === 'INCIDENT' && (
                    <>
                      <input name="title" required placeholder="Incident Title" className="w-full p-2 border rounded" onChange={handleInputChange} />
                      <div className="grid grid-cols-2 gap-4">
                        <input name="dateOccurred" type="date" required className="w-full p-2 border rounded" onChange={handleInputChange} />
                        <select name="severity" className="w-full p-2 border rounded" onChange={handleInputChange}>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="CRITICAL">Critical</option>
                        </select>
                      </div>
                      <textarea name="description" required placeholder="Description" rows={3} className="w-full p-2 border rounded" onChange={handleInputChange}></textarea>
                    </>
                  )}

                  {modalType === 'DATA' && (
                    <>
                      <select name="direction" required className="w-full p-2 border rounded" onChange={handleInputChange}>
                        <option value="INBOUND">Inbound</option>
                        <option value="OUTBOUND">Outbound</option>
                        <option value="BIDIRECTIONAL">Bidirectional</option>
                      </select>
                      <input name="dataTypes" required placeholder="Data Types (comma separated)" className="w-full p-2 border rounded" onChange={handleInputChange} />
                      <input name="description" required placeholder="Description" className="w-full p-2 border rounded" onChange={handleInputChange} />
                    </>
                  )}

                  {modalType === 'ASSESSMENT' && (
                    <div className="space-y-6">
                      <p className="text-sm text-slate-500">Rate the vendor on the following criteria (1 = Poor, 5 = Excellent). Scores are weighted automatically.</p>
                      {MOCK_RISK_CRITERIA.map(criteria => (
                        <div key={criteria.id} className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <p className="font-semibold text-slate-700 text-sm">{criteria.label}</p>
                                <p className="text-xs text-slate-500">{criteria.description}</p>
                             </div>
                             <span className="text-xs font-mono bg-white px-2 py-1 rounded border">Weight: {criteria.weight}%</span>
                          </div>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setAssessmentScores(prev => ({ ...prev, [criteria.id]: rating }))}
                                className={`flex-1 py-2 text-sm rounded font-medium transition-colors ${
                                  assessmentScores[criteria.id] === rating 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                {rating}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                    <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium shadow-sm">
                      {modalType === 'ASSESSMENT' ? 'Submit Assessment' : 'Submit'}
                    </button>
                  </div>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetail;
