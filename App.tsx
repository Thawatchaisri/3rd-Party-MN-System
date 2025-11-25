

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VendorList from './pages/VendorList';
import VendorDetail from './pages/VendorDetail';
import RiskCriteriaPage from './pages/RiskCriteria';
import ApprovalsPage from './pages/Approvals';
import ActivityLogsPage from './pages/ActivityLogs';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import { UserRole, Vendor } from './types';
import { 
  MOCK_VENDORS, 
  MOCK_CONTRACTS, 
  MOCK_INCIDENTS, 
  MOCK_DATA_FLOWS, 
  MOCK_RISK_CRITERIA, 
  MOCK_APPROVALS, 
  MOCK_AUDIT_LOGS 
} from './constants';

interface CurrentUser {
  name: string;
  role: UserRole;
}

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Routing State
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  
  // Navigation Handler
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== 'vendor_detail') {
      setSelectedVendor(null);
    }
  };

  const handleSelectVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setCurrentPage('vendor_detail');
  };

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  // If not logged in, show Login page
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard vendors={MOCK_VENDORS} />;
      case 'vendors':
        return <VendorList vendors={MOCK_VENDORS} onSelectVendor={handleSelectVendor} />;
      case 'vendor_detail':
        if (!selectedVendor) return <div>Error: No vendor selected</div>;
        return (
          <VendorDetail 
            vendor={selectedVendor}
            contracts={MOCK_CONTRACTS.filter(c => c.vendorId === selectedVendor.id)}
            incidents={MOCK_INCIDENTS.filter(i => i.vendorId === selectedVendor.id)}
            dataFlows={MOCK_DATA_FLOWS.filter(d => d.vendorId === selectedVendor.id)}
            onBack={() => handleNavigate('vendors')} 
          />
        );
      case 'risk':
        return <RiskCriteriaPage criteria={MOCK_RISK_CRITERIA} />;
      case 'approvals':
        return <ApprovalsPage requests={MOCK_APPROVALS} />;
      case 'activity':
        return <ActivityLogsPage logs={MOCK_AUDIT_LOGS} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard vendors={MOCK_VENDORS} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout}
        userRole={currentUser.role}
        userName={currentUser.name}
      />
      <main className="flex-1 ml-64 p-2 overflow-y-auto h-screen">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
