import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Shield, LogOut, Phone, Heart, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface UserProfilePageProps {
  userProfile: any;
  session: any;
  onBack: () => void;
}

export default function UserProfilePage({ userProfile, session, onBack }: UserProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [wards, setWards] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || '',
    email: userProfile?.email || session?.user?.email || '',
    phone: userProfile?.phone || '',
    home_ward: userProfile?.home_ward || '',
    has_asthma: userProfile?.has_asthma || false,
    has_copd: userProfile?.has_copd || false,
    has_heart_disease: userProfile?.has_heart_disease || false,
  });

  useEffect(() => {
    // Fetch ward list from backend
    const fetchWards = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8080";
        const res = await fetch(`${API_BASE}/api/v1/dashboard/wards?level=ward`);
        if (res.ok) {
          const data = await res.json();
          const wardNames = data.map((w: any) => w.name).sort();
          setWards(wardNames);
        }
      } catch (error) {
        console.error('Failed to fetch wards:', error);
      }
    };
    fetchWards();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          home_ward: formData.home_ward,
          has_asthma: formData.has_asthma,
          has_copd: formData.has_copd,
          has_heart_disease: formData.has_heart_disease,
        })
        .eq('id', userProfile.id);

      if (error) throw error;
      
      alert('Profile updated successfully!');
      setIsEditing(false);
      window.location.reload(); // Refresh to get updated profile
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Failed to save profile: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-semibold">User Profile</h1>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white text-4xl font-bold uppercase border-4 border-white/30">
              {formData.full_name?.charAt(0) || formData.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{formData.full_name || 'User'}</h2>
              <p className="text-cyan-100 text-lg uppercase tracking-wider font-mono">{userProfile?.role || 'Citizen'}</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-8 space-y-6">
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>{formData.email}</span>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          {/* Home Ward */}
          <div>
            <label className="block text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">
              Home Ward
            </label>
            <select
              value={formData.home_ward}
              onChange={(e) => setFormData({ ...formData, home_ward: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
            >
              <option value="">Select your ward</option>
              {wards.map((ward) => (
                <option key={ward} value={ward}>{ward}</option>
              ))}
            </select>
          </div>

          {/* Health Conditions */}
          <div>
            <label className="block text-sm font-mono text-slate-400 uppercase tracking-wider mb-4">
              Health Conditions
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.has_asthma}
                  onChange={(e) => setFormData({ ...formData, has_asthma: e.target.checked })}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-white">Asthma</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.has_copd}
                  onChange={(e) => setFormData({ ...formData, has_copd: e.target.checked })}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <Heart className="w-5 h-5 text-orange-400" />
                <span className="text-white">COPD (Chronic Obstructive Pulmonary Disease)</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer hover:border-slate-600 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.has_heart_disease}
                  onChange={(e) => setFormData({ ...formData, has_heart_disease: e.target.checked })}
                  disabled={!isEditing}
                  className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                />
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-white">Heart Disease</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-all"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    full_name: userProfile?.full_name || '',
                    email: userProfile?.email || session?.user?.email || '',
                    phone: userProfile?.phone || '',
                    home_ward: userProfile?.home_ward || '',
                    has_asthma: userProfile?.has_asthma || false,
                    has_copd: userProfile?.has_copd || false,
                    has_heart_disease: userProfile?.has_heart_disease || false,
                  });
                }}
                className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-lg font-semibold transition-all"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

      </main>
    </div>
  );
}
