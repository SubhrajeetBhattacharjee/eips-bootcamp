'use client';

import { useState, useEffect } from 'react';
import { useSession, authClient } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import { Camera, MapPin, Briefcase, Link as LinkIcon, User, Save, Globe, Code, BadgeCheck } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [college, setCollege] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  
  // Fetch full profile on load
  useEffect(() => {
    if (!user) return;
    
    async function fetchProfile() {
      try {
        const res = await fetch('/api/dashboard/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.name) setName(data.name);
          if (data.image) setImage(data.image);
          if (data.profile) {
            setCollege(data.profile.college || '');
            setCity(data.profile.city || '');
            setCountry(data.profile.country || '');
            setBio(data.profile.bio || '');
            setHobbies(data.profile.hobbies || '');
            setTwitter(data.profile.twitter || '');
            setGithub(data.profile.github || '');
            setLinkedin(data.profile.linkedin || '');
          }
        }
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setFetching(false);
      }
    }
    
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // 1. Update BetterAuth session natively
      await authClient.updateUser({ name, image });

      // 2. Update Database via our custom API
      const res = await fetch('/api/dashboard/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image, college, city, country, bio, hobbies, twitter, github, linkedin }),
      });
      
      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile');
      }
    } catch (err) {
      setMessage('An error occurred while saving.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (!user || fetching) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-64 text-zinc-400">Loading profile...</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Profile</h1>
          <p className="text-zinc-400 mt-1">Manage your public information and social presence.</p>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-900/40 to-[#0a0a0a] border-b border-white/5"></div>
          
          <div className="p-8 -mt-16 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 mb-8">
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl ring-4 ring-[#0a0a0a] overflow-hidden bg-emerald-500/10 flex items-center justify-center">
                  {image ? (
                    <img src={image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-emerald-400 text-4xl font-bold">{name.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer ring-4 ring-[#0a0a0a]">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-white">{name || 'Unnamed User'}</h2>
                <p className="text-emerald-400/80 font-medium">{user.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User size={18} className="text-emerald-400" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Profile Picture URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell the community a little about yourself..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-emerald-400" />
                  Education & Interests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">College / University</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. MIT, Stanford"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Hobbies & Interests</label>
                    <input
                      type="text"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder="e.g. Web3, Smart Contracts, Reading"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. San Francisco"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5"></div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <LinkIcon size={18} className="text-emerald-400" />
                  Social Links
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="bg-white/5 border border-r-0 border-white/10 rounded-l-lg px-4 py-2.5 text-zinc-400 h-[42px] flex items-center w-12 justify-center">
                      <Globe size={18} />
                    </span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors h-[42px]"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="bg-white/5 border border-r-0 border-white/10 rounded-l-lg px-4 py-2.5 text-zinc-400 h-[42px] flex items-center w-12 justify-center">
                      <Code size={18} />
                    </span>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors h-[42px]"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="bg-white/5 border border-r-0 border-white/10 rounded-l-lg px-4 py-2.5 text-zinc-400 h-[42px] flex items-center w-12 justify-center">
                      <Briefcase size={18} />
                    </span>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 bg-white/5 border border-white/10 rounded-r-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 transition-colors h-[42px]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Message */}
              {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.includes('success') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {message.includes('success') ? <BadgeCheck size={20} /> : null}
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 active:scale-95"
                >
                  <Save size={18} />
                  {loading ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
