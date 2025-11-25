import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShieldAlert, 
  Settings, 
  LogOut,
  Activity
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userRole: UserRole;
  userName?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, userRole, userName }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'approvals', label: 'Approvals', icon: FileText },
    { id: 'risk', label: 'Risk Criteria', icon: ShieldAlert },
    { id: 'activity', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <ShieldAlert className="text-white w-5 h-5" />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">VendorGuard</span>
      </div>

      <div className="px-6 py-2">
        <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider mb-2">Main Menu</p>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentPage === item.id;
             return (
               <button
                 key={item.id}
                 onClick={() => onNavigate(item.id)}
                 className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                   isActive 
                     ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                     : 'hover:bg-slate-800 hover:text-white'
                 }`}
               >
                 <Icon size={18} />
                 <span className="font-medium text-sm">{item.label}</span>
               </button>
             );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
            {userName ? userName.substring(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{userName || 'Admin User'}</p>
            <p className="text-xs text-slate-500">{userRole}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 py-2 rounded-lg transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;