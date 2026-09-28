import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, Award, CheckCircle2, Save, Trophy, Activity } from 'lucide-react';

export const UserProfile = () => {
  const { userProfile, updateUserProfile, addToast } = useApp();
  const [profile, setProfile] = useState(userProfile);

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (updateUserProfile) {
      await updateUserProfile(profile);
    } else {
      addToast('Profile changes saved successfully!', 'success');
    }
  };

  const initials = (profile.name || 'Student Athlete')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <h1 className="text-2xl font-black font-urbanist tracking-tight">My Athlete Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Profile Info Card */}
        <div className="material-card p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white text-2xl font-black font-urbanist mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
            {initials || 'SP'}
          </div>

          <div>
            <h2 className="font-black text-lg font-urbanist">{profile.name}</h2>
            <p className="text-xs text-slate-500">{profile.role || 'Athlete'} • Member ID: SP-9912</p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 text-left text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-blue-500" /> {profile.email}</div>
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-emerald-500" /> {profile.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-purple-500" /> {profile.location}</div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-around text-center text-xs">
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{profile.stats.wins}</p>
              <span className="text-[10px] text-slate-400">Wins</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{profile.stats.registeredTournaments}</p>
              <span className="text-[10px] text-slate-400">Events</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">{profile.stats.certificates}</p>
              <span className="text-[10px] text-slate-400">Badges</span>
            </div>
          </div>
        </div>

        {/* Right: Edit Profile Form */}
        <div className="md:col-span-2 material-card p-6 space-y-4">
          <h3 className="font-bold text-base font-outfit">Edit Personal & Sports Info</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="input-field py-2"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="input-field py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field py-2"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <input 
                  type="text" 
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  className="input-field py-2"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Athlete Bio & Experience</label>
              <textarea 
                rows="3"
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="input-field py-2"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button type="submit" className="btn btn-primary py-2 px-4 text-xs font-semibold">
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
