
import React, { useState, useEffect } from 'react';
import { Save, Shield, Users, Globe, Lock, Bell, Plus, Edit2, AlertCircle } from 'lucide-react';

// --- Skeleton Components ---

const ProfileSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="h-7 w-32 bg-slate-800 rounded mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-800 rounded" />
        <div className="h-12 w-full bg-slate-800 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 bg-slate-800 rounded" />
        <div className="h-12 w-full bg-slate-800 rounded-lg" />
      </div>
      <div className="col-span-full space-y-2">
        <div className="h-3 w-24 bg-slate-800 rounded" />
        <div className="h-12 w-full bg-slate-800 rounded-lg" />
      </div>
    </div>
    <div className="flex justify-end">
      <div className="h-10 w-32 bg-slate-800 rounded-xl" />
    </div>
  </div>
);

const RolesSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="space-y-2">
        <div className="h-7 w-48 bg-slate-800 rounded" />
        <div className="h-4 w-64 bg-slate-800 rounded" />
      </div>
      <div className="h-8 w-28 bg-slate-800 rounded-xl" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-3 w-48 bg-slate-800 rounded" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-16 bg-slate-800 rounded-md" />
            <div className="h-4 w-4 bg-slate-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SecuritySkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="h-7 w-40 bg-slate-800 rounded mb-6" />
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-32 bg-slate-800 rounded" />
        <div className="h-12 w-full bg-slate-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-800 rounded" />
          <div className="h-12 w-full bg-slate-800 rounded-lg" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-36 bg-slate-800 rounded" />
          <div className="h-12 w-full bg-slate-800 rounded-lg" />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <div className="h-10 w-32 bg-slate-800 rounded-xl" />
      </div>
      <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-slate-800 rounded" />
          <div className="h-3 w-64 bg-slate-800 rounded" />
        </div>
        <div className="h-6 w-11 bg-slate-800 rounded-full" />
      </div>
    </div>
  </div>
);

const SystemSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
    <div className="h-7 w-32 bg-slate-800 rounded mb-6" />
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-800 rounded" />
          <div className="h-3 w-56 bg-slate-800 rounded" />
        </div>
        <div className="h-6 w-11 bg-slate-800 rounded-full" />
      </div>
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <div className="h-3 w-36 bg-slate-800 rounded" />
        <div className="h-12 w-full bg-slate-800 rounded-lg" />
      </div>
    </div>
  </div>
);

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock State for Form Fields
  const [profile, setProfile] = useState({
    name: 'Admin Name',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567'
  });

  const [security, setSecurity] = useState({
    currentPwd: '',
    newPwd: '',
    confirmPwd: '',
    twoFactor: true
  });

  const [system, setSystem] = useState({
    maintenance: false,
    rulesUrl: 'https://example.com/community-rules'
  });

  const roles = [
    { id: 1, name: 'Administrator', desc: 'Full access to all system features.', users: 2 },
    { id: 2, name: 'Building Manager', desc: 'Manages maintenance and resident communication.', users: 5 },
    { id: 3, name: 'Accountant', desc: 'Access to billing and financial information.', users: 1 },
  ];

  // Simulate Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Header */}
      <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-heading text-white">Administrator Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {isLoading ? (
            <>
              <ProfileSkeleton />
              <RolesSkeleton />
              <SecuritySkeleton />
              <SystemSkeleton />
            </>
          ) : (
            <>
              {/* Section 1: Admin Profile */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="text-lg font-bold text-white mb-6">Admin Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-full space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase">Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Section 2: User Roles & Permissions */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">User Roles & Permissions</h2>
                    <p className="text-slate-400 text-sm mt-1">Manage and assign different roles and access levels to users.</p>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all">
                    Add New Role
                  </button>
                </div>

                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl group hover:border-slate-700 transition-colors">
                      <div>
                        <h3 className="text-slate-200 font-bold text-sm">{role.name}</h3>
                        <p className="text-slate-500 text-xs mt-0.5">{role.desc}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-xs font-medium bg-slate-800 px-2 py-1 rounded-md">{role.users} Users</span>
                        <button className="text-slate-500 hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Password & Security */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <h2 className="text-lg font-bold text-white mb-6">Password & Security</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase">Current Password</label>
                    <input 
                      type="password" 
                      value={security.currentPwd}
                      onChange={(e) => setSecurity({...security, currentPwd: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">New Password</label>
                      <input 
                        type="password" 
                        value={security.newPwd}
                        onChange={(e) => setSecurity({...security, newPwd: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={security.confirmPwd}
                        onChange={(e) => setSecurity({...security, confirmPwd: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                      Save Changes
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-slate-200 font-bold text-sm">Two-Factor Authentication (2FA)</h3>
                      <p className="text-slate-500 text-xs mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <ToggleSwitch 
                      checked={security.twoFactor} 
                      onChange={(v) => setSecurity({...security, twoFactor: v})} 
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: System Settings */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                <h2 className="text-lg font-bold text-white mb-6">System Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-slate-200 font-bold text-sm">Enable Maintenance Mode</h3>
                        <p className="text-slate-500 text-xs mt-1">Temporarily restrict access for system updates.</p>
                      </div>
                      <ToggleSwitch 
                        checked={system.maintenance} 
                        onChange={(v) => setSystem({...system, maintenance: v})} 
                      />
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2">
                      <label className="text-xs font-medium text-slate-400 uppercase">Community Rules URL</label>
                      <input 
                        type="text" 
                        value={system.rulesUrl}
                        onChange={(e) => setSystem({...system, rulesUrl: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
