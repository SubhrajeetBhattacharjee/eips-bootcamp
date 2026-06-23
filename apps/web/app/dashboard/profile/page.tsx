'use client';

import { useState, useEffect } from 'react';
import { useSession, authClient } from '@/app/lib/auth-client';
import { DashboardShell } from '@/app/components/dashboard/DashboardShell';
import LoadingScreen from '@/app/components/ui/LoadingScreen';
import { Camera, MapPin, Briefcase, Link as LinkIcon, User, Save, Globe, Code, BadgeCheck, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const XTwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function ProfilePage() {
  const { data: session, isPending: isLoading } = useSession();
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
  const [walletAddress, setWalletAddress] = useState('');

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
          if (data.walletAddress) setWalletAddress(data.walletAddress);
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

  const { address } = useAccount();

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
        body: JSON.stringify({
          name,
          image,
          college,
          city,
          country,
          bio,
          hobbies,
          twitter,
          github,
          linkedin,
          walletAddress: address || null,
        }),
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

  if (isLoading || fetching) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[500px]">
          <LoadingScreen text="LOADING PROFILE..." fullScreen={false} />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your public information and social presence.</p>
        </div>
        
        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-900/40 to-[#0a0a0a] border-b border-border"></div>
          
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
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer ring-4 ring-[#0a0a0a]">
                  <Camera size={24} className="text-foreground" />
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-foreground">{name || 'Unnamed User'}</h2>
                <p className="text-emerald-400/80 font-medium">{user?.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <User size={18} className="text-emerald-400" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Profile Picture URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/avatar.png"
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell the community a little about yourself..."
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-accent"></div>

              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Briefcase size={18} className="text-emerald-400" />
                  Education & Interests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">College / University</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. MIT, Stanford"
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Hobbies & Interests</label>
                    <input
                      type="text"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      placeholder="e.g. Web3, Smart Contracts, Reading"
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. San Francisco"
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full bg-accent border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-accent"></div>

              {/* Web3 Wallet Section */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Wallet size={18} className="text-emerald-400" />
                  Web3 Wallet
                </h3>
                <div className="p-4 bg-accent/50 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Connected Wallet</h4>
                    {walletAddress ? (
                      <p className="text-xs text-emerald-400 font-mono">Linked: {walletAddress}</p>
                    ) : address ? (
                      <p className="text-xs text-amber-400 font-mono">Connected (unsaved): {address}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Link your wallet to participate in on-chain activities.</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {address && address !== walletAddress && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            setLoading(true);
                            const res = await fetch('/api/dashboard/profile', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name,
                                image,
                                college,
                                city,
                                country,
                                bio,
                                hobbies,
                                twitter,
                                github,
                                linkedin,
                                walletAddress: address,
                              }),
                            });
                            if (res.ok) {
                              setWalletAddress(address);
                              setMessage('Wallet linked successfully!');
                            } else {
                              setMessage('Failed to link wallet');
                            }
                          } catch {
                            setMessage('Failed to link wallet');
                          } finally {
                            setLoading(false);
                            setTimeout(() => setMessage(''), 3000);
                          }
                        }}
                        className="text-xs bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Link Wallet
                      </button>
                    )}
                    <ConnectButton />
                  </div>
                </div>
              </div>

              <div className="h-px bg-accent"></div>

              {/* Social Links s*/}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <LinkIcon size={18} className="text-emerald-400" />
                  Social Links
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="bg-accent border border-r-0 border-border rounded-l-lg px-4 py-2.5 text-muted-foreground h-[42px] flex items-center w-12 justify-center">
                      <XTwitterIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="flex-1 bg-accent border border-border rounded-r-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors h-[42px]"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="bg-accent border border-r-0 border-border rounded-l-lg px-4 py-2.5 text-muted-foreground h-[42px] flex items-center w-12 justify-center">
                      <GithubIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="flex-1 bg-accent border border-border rounded-r-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors h-[42px]"
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="bg-accent border border-r-0 border-border rounded-l-lg px-4 py-2.5 text-muted-foreground h-[42px] flex items-center w-12 justify-center">
                      <LinkedInIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="flex-1 bg-accent border border-border rounded-r-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-emerald-500/50 transition-colors h-[42px]"
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
