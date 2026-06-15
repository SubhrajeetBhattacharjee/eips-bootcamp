"use client";

import React, { useState } from "react";
import { useSession } from '@/app/lib/auth-client';
import { CAPFormData, submitCAPApplication, CAPApplication } from "../../lib/Cap";
import { ChevronRight, ChevronLeft, Zap, Users, GraduationCap, CheckCircle2, Trophy } from "lucide-react";

interface Props {
  onSubmitted: (app: CAPApplication) => void;
}

const GRAD_YEARS = ["2024", "2025", "2026", "2027", "2028", "2029"];

export default function CapApplicationForm({ onSubmitted }: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CAPFormData>({
    fullName: "",
    college: "",
    graduationYear: "2026",
    city: "",
    socialLinks: "",
    whyJoin: "",
    communityExperience: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CAPFormData>>({});

  const validateStep2 = (): boolean => {
    const e: Partial<CAPFormData> = {};
    if (!form.fullName.trim()) e.fullName = "Name is required";
    if (!form.college.trim()) e.college = "College is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Partial<CAPFormData> = {};
    if (!form.city.trim()) e.city = "City is required";
    if (!form.socialLinks.trim()) e.socialLinks = "Social links are required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep4 = (): boolean => {
    const e: Partial<CAPFormData> = {};
    if (!form.whyJoin.trim()) e.whyJoin = "Tell us why you want to join";
    if (!form.communityExperience.trim()) e.communityExperience = "Share your community experience";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validateStep4()) return;
    setSubmitting(true);
    try {
      const userId = user?.id;
      if (!userId) {
        setSubmitting(false);
        return;
      }

      const app = await submitCAPApplication(userId, form, {
        email: user.email,
        username: user.username,
      });
      onSubmitted(app);
    } catch {
      setSubmitting(false);
    }
  };

  // Progress calculation
  const totalSteps = 4;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto relative min-h-[500px] flex flex-col justify-center">
      {/* Dynamic Background Glow based on step */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-lg blur-[120px] rounded-full pointer-events-none transition-all duration-1000"
        style={{
          background: step === 1 ? 'rgba(52, 211, 153, 0.15)' : 
                      step === 4 ? 'rgba(59, 130, 246, 0.15)' : 
                      'rgba(16, 185, 129, 0.1)'
        }}
      />

      <div
        className="relative z-10 rounded-3xl border border-white/[0.08] overflow-hidden transition-all duration-500 bg-background/40 backdrop-blur-3xl shadow-2xl"
      >
        {/* Progress Bar */}
        {step > 1 && (
          <div className="w-full h-1 bg-accent relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-8 sm:p-12 relative">
          
          {/* STEP 1: THE PITCH */}
          <div className={`transition-all duration-500 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 pointer-events-none translate-x-12'}`}>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4 animate-pulse">
                <Trophy className="w-12 h-12 text-emerald-400" />
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-foreground via-emerald-500 to-emerald-400 tracking-tight">
                Become a Campus Ambassador
              </h2>
              
              <p className="text-lg text-foreground/60 max-w-xl mx-auto leading-relaxed">
                Join an elite group of student leaders. Bring EthShala to your college, host exclusive seminars, and build the future of Ethereum education.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 pb-10">
                <div className="p-4 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Users size={20}/></div>
                  <div className="text-sm font-semibold text-foreground">Host Seminars</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400"><Zap size={20}/></div>
                  <div className="text-sm font-semibold text-foreground">Earn XP</div>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><GraduationCap size={20}/></div>
                  <div className="text-sm font-semibold text-foreground">Unlock Perks</div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 transition-all duration-300"
              >
                Start Application
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* STEP 2: PERSONAL IDENTITY */}
          <div className={`transition-all duration-500 ${step === 2 ? 'opacity-100 translate-x-0' : step < 2 ? 'opacity-0 absolute inset-0 pointer-events-none -translate-x-12' : 'opacity-0 absolute inset-0 pointer-events-none translate-x-12'}`}>
            <StepHeader step="01" title="Who are you?" subtitle="Let's start with the basics." />
            
            <div className="space-y-6">
              <InputField 
                label="Full Name" 
                name="fullName" 
                value={form.fullName} 
                onChange={handleChange} 
                error={errors.fullName} 
                placeholder="Vitalik Buterin" 
              />
              <InputField 
                label="College / University" 
                name="college" 
                value={form.college} 
                onChange={handleChange} 
                error={errors.college} 
                placeholder="University of Waterloo" 
              />
              
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Graduation Year</label>
                <div className="relative group">
                  <select
                    name="graduationYear"
                    value={form.graduationYear}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl text-foreground appearance-none outline-none transition-all duration-300 bg-accent border border-border hover:border-emerald-500/50 focus:border-emerald-500 focus:bg-accent focus:ring-4 focus:ring-emerald-500/10 cursor-pointer"
                  >
                    {GRAD_YEARS.map((y) => (
                      <option key={y} value={y} className="bg-card text-foreground">{y}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-foreground/30 group-hover:text-emerald-400 rotate-90 transition-colors pointer-events-none" />
                </div>
              </div>
            </div>

            <NavigationButtons onBack={handleBack} onNext={handleNext} />
          </div>

          {/* STEP 3: ONLINE PRESENCE */}
          <div className={`transition-all duration-500 ${step === 3 ? 'opacity-100 translate-x-0' : step < 3 ? 'opacity-0 absolute inset-0 pointer-events-none -translate-x-12' : 'opacity-0 absolute inset-0 pointer-events-none translate-x-12'}`}>
            <StepHeader step="02" title="Where are you based?" subtitle="We want to know where you're representing." />
            
            <div className="space-y-6">
              <InputField 
                label="City & Country" 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                error={errors.city} 
                placeholder="San Francisco, USA" 
              />
              <InputField 
                label="Social Links" 
                name="socialLinks" 
                value={form.socialLinks} 
                onChange={handleChange} 
                error={errors.socialLinks} 
                placeholder="https://twitter.com/yourhandle" 
                hint="Twitter / LinkedIn / GitHub"
              />
            </div>

            <NavigationButtons onBack={handleBack} onNext={handleNext} />
          </div>

          {/* STEP 4: THE DRIVE */}
          <div className={`transition-all duration-500 ${step === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 pointer-events-none -translate-x-12'}`}>
            <StepHeader step="03" title="The Pitch" subtitle="Why should you be our next ambassador?" />
            
            <div className="space-y-6">
              <TextareaField 
                label="Why do you want to join the CAP program?" 
                name="whyJoin" 
                value={form.whyJoin} 
                onChange={handleChange} 
                error={errors.whyJoin} 
                placeholder="I am passionate about..." 
              />
              <TextareaField 
                label="Community Experience" 
                name="communityExperience" 
                value={form.communityExperience} 
                onChange={handleChange} 
                error={errors.communityExperience} 
                placeholder="Organized a hackathon with 500+ attendees..." 
                hint="Hackathons, Clubs, Events"
              />
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="p-4 rounded-full bg-accent hover:bg-accent text-foreground transition-colors"
              >
                <ChevronLeft />
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="relative flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:to-emerald-300 text-black font-bold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:scale-100 hover:scale-105 shadow-[0_0_40px_rgba(52,211,153,0.4)]"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Shared UI Components ──────────────────────────────────────────────────

function StepHeader({ step, title, subtitle }: { step: string, title: string, subtitle: string }) {
  return (
    <div className="mb-10">
      <div className="text-emerald-400 font-mono text-sm tracking-widest mb-3">STEP {step}</div>
      <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{title}</h2>
      <p className="text-foreground/50">{subtitle}</p>
    </div>
  );
}

function InputField({ label, name, value, onChange, placeholder, error, hint }: any) {
  const isFilled = value.trim().length > 0;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-medium text-foreground/70">{label}</label>
        {hint && <span className="text-xs text-foreground/30">{hint}</span>}
      </div>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-5 py-4 rounded-2xl text-foreground placeholder:text-muted-foreground outline-none transition-all duration-300 bg-accent border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border hover:border-emerald-500/50 focus:border-emerald-500 focus:bg-accent focus:ring-4 focus:ring-emerald-500/10'}`}
        />
        {isFilled && !error && (
          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 w-5 h-5" />
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400 inline-block"/> {error}</p>}
    </div>
  );
}

function TextareaField({ label, name, value, onChange, placeholder, error, hint }: any) {
  const maxLength = 500;
  const isFilled = value.trim().length > 10;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <label className="block text-sm font-medium text-foreground/70">{label}</label>
        {hint && <span className="text-xs text-foreground/30">{hint}</span>}
      </div>
      <div className="relative">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          maxLength={maxLength}
          className={`w-full px-5 py-4 rounded-2xl text-foreground placeholder:text-muted-foreground outline-none resize-none transition-all duration-300 bg-accent border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' : 'border-border hover:border-emerald-500/50 focus:border-emerald-500 focus:bg-accent focus:ring-4 focus:ring-emerald-500/10'}`}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {isFilled && !error && <CheckCircle2 className="text-emerald-500 w-4 h-4" />}
          <span className={`text-xs ${value.length >= maxLength ? 'text-red-400' : 'text-foreground/20'}`}>
            {value.length}/{maxLength}
          </span>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400 inline-block"/> {error}</p>}
    </div>
  );
}

function NavigationButtons({ onBack, onNext }: { onBack: () => void, onNext: () => void }) {
  return (
    <div className="mt-8 flex items-center justify-between pt-6 border-t border-border">
      <button 
        onClick={onBack}
        className="p-4 rounded-full bg-accent hover:bg-accent text-foreground transition-colors"
      >
        <ChevronLeft />
      </button>
      <button 
        onClick={onNext}
        className="flex items-center gap-2 px-8 py-4 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-2xl transition-all hover:scale-105"
      >
        Continue
        <ChevronRight size={18} />
      </button>
    </div>
  );
}