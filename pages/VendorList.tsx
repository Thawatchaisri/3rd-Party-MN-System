
import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronRight, X, UploadCloud, Download } from 'lucide-react';
import { Vendor, VendorStatus } from '../types';
import RiskBadge from '../components/RiskBadge';
import { exportToCSV } from '../utils/export';

interface VendorListProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
}

const VendorList: React.FC<VendorListProps> = ({ vendors, onSelectVendor }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modal State
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    category: '',
    contactPerson: '',
    email: '',
    website: '',
    description: ''
  });

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewVendorData({
      ...newVendorData,
      [e.target.name]: e.target.value
    });
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Submitting new vendor:", newVendorData);
    alert(`Vendor request for "${newVendorData.name}" has been submitted for approval.`);
    setIsOnboardModalOpen(false);
    setNewVendorData({
      name: '',
      category: '',
      contactPerson: '',
      email: '',
      website: '',
      description: ''
    });
  };

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor Management</h1>
          <p className="text-slate-500 mt-1">Manage third-party relationships and assess risks.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportToCSV(vendors, 'vendors_list')}
            className="bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsOnboardModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Onboard Vendor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search vendors by name or category..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="border border-slate-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {Object.values(VendorStatus).map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4 text-center">Score</th>
                <th className="px-6 py-4">Last Audit</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVendors.map((vendor) => (
                <tr 
                  key={vendor.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => onSelectVendor(vendor)}
                >
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {vendor.name.substring(0, 2).toUpperCase()}
                    </div>
                    {vendor.name}
                  </td>
                  <td className="px-6 py-4">{vendor.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      vendor.status === VendorStatus.ACTIVE ? 'bg-blue-100 text-blue-800' :
                      (vendor.status === VendorStatus.SUSPENDED || vendor.status === VendorStatus.TERMINATED) ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {vendor.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <RiskBadge level={vendor.riskLevel} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                       <div className="w-full bg-slate-200 rounded-full h-1.5 w-16">
                          <div 
                            className={`h-1.5 rounded-full ${vendor.riskScore > 80 ? 'bg-green-500' : vendor.riskScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${vendor.riskScore}%` }}
                          ></div>
                       </div>
                       <span className="text-xs text-slate-400">{vendor.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">Oct 24, 2023</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVendors.length === 0 && (
             <div className="p-12 text-center text-slate-400">
               No vendors found matching your criteria.
             </div>
          )}
        </div>
      </div>

      {/* Onboarding Modal */}
      {isOnboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">Onboard New Vendor</h3>
                <p className="text-xs text-slate-500">Enter vendor details for risk assessment.</p>
              </div>
              <button onClick={() => setIsOnboardModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleOnboardSubmit} className="p-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                  <input 
                    required
                    name="name"
                    value={newVendorData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      name="category"
                      value={newVendorData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                    >
                      <option value="">Select Category</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Data Processor">Data Processor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                    <input 
                      required
                      name="contactPerson"
                      value={newVendorData.contactPerson}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                      type="email"
                      required
                      name="email"
                      value={newVendorData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="contact@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                    <input 
                      type="url"
                      name="website"
                      value={newVendorData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description & Scope</label>
                  <textarea 
                    name="description"
                    value={newVendorData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
                    placeholder="Describe the services provided..."
                  />
                </div>

                <div className="pt-2">
                   <div className="border border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <UploadCloud size={32} className="mb-2" />
                      <span className="text-xs font-medium">Upload Initial Contracts or NDA</span>
                   </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsOnboardModalOpen(false)}
                  className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
