'use client';

import { useState, useEffect, useRef } from 'react';
import { BookOpen, FileText, Vote, Search, GitBranch, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { learningTracks, type LearningTrack } from '../../lib/landing-data';

// Level color mapping for badges
const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

// Icon mapping for each track
const iconMap: Record<LearningTrack['icon'], React.ReactNode> = {
  book: <BookOpen size={24} />,
  'file-text': <FileText size={24} />,
  vote: <Vote size={24} />,
  search: <Search size={24} />,
  'git-branch': <GitBranch size={24} />,
};

// SVG Placeholder icons for the 3D illustrations
const IllustrationPlaceholder = ({ level, cardNumber }: { level: string; cardNumber: number }) => {
  const colorMap: Record<string, { primary: string; secondary: string; tertiary: string }> = {
    Beginner: { primary: '#10b981', secondary: '#059669', tertiary: '#047857' }, // Emerald
    Intermediate: { primary: '#3b82f6', secondary: '#2563eb', tertiary: '#1d4ed8' }, // Blue
    Advanced: { primary: '#a855f7', secondary: '#9333ea', tertiary: '#7e22ce' }, // Purple
  };

  const colors = colorMap[level] || colorMap.Beginner;

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 20px rgba(' + parseInt(colors.primary.slice(1, 3), 16) + ', ' + parseInt(colors.primary.slice(3, 5), 16) + ', ' + parseInt(colors.primary.slice(5, 7), 16) + ', 0.3))' }}
    >
      {/* Background glow circle */}
      <circle cx="100" cy="100" r="80" fill={colors.primary} opacity="0.1" />
      <circle cx="100" cy="100" r="70" fill={colors.secondary} opacity="0.05" />

      {/* Floating particles/nodes */}
      <circle cx="60" cy="70" r="3" fill={colors.primary} opacity="0.8" />
      <circle cx="140" cy="70" r="3" fill={colors.secondary} opacity="0.8" />
      <circle cx="100" cy="140" r="3" fill={colors.tertiary} opacity="0.8" />
      <circle cx="50" cy="100" r="2" fill={colors.primary} opacity="0.6" />
      <circle cx="150" cy="100" r="2" fill={colors.secondary} opacity="0.6" />

      {/* Center geometric shape based on card number */}
      {cardNumber === 0 && (
        // Ethereum diamond
        <>
          <polygon
            points="100,50 130,85 100,130 70,85"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            opacity="0.9"
          />
          <polygon
            points="100,65 120,100 100,115 80,100"
            fill={colors.primary}
            opacity="0.4"
          />
          {/* Connection lines */}
          <line x1="100" y1="50" x2="60" y2="70" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
          <line x1="100" y1="50" x2="140" y2="70" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
          <line x1="100" y1="130" x2="50" y2="100" stroke={colors.tertiary} strokeWidth="1" opacity="0.4" />
          <line x1="100" y1="130" x2="150" y2="100" stroke={colors.secondary} strokeWidth="1" opacity="0.4" />
        </>
      )}

      {cardNumber === 1 && (
        // Magnifying glass with docs
        <>
          <circle
            cx="80" cy="90" r="25"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2.5"
            opacity="0.8"
          />
          <line x1="102" y1="112" x2="125" y2="135" stroke={colors.primary} strokeWidth="2.5" opacity="0.8" />
          {/* Document rectangles */}
          <rect x="115" y="60" width="20" height="25" fill={colors.secondary} opacity="0.5" rx="2" />
          <rect x="120" y="65" width="20" height="25" fill={colors.tertiary} opacity="0.4" rx="2" />
          {/* Dots inside circle */}
          <circle cx="75" cy="85" r="2" fill={colors.primary} opacity="0.8" />
          <circle cx="85" cy="95" r="2" fill={colors.secondary} opacity="0.8" />
        </>
      )}

      {cardNumber === 2 && (
        // Governance/Building with shield
        <>
          <polygon
            points="100,50 140,75 140,130 100,150 60,130 60,75"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            opacity="0.8"
          />
          <polygon
            points="100,60 130,80 130,120 100,135 70,120 70,80"
            fill={colors.secondary}
            opacity="0.3"
          />
          {/* Shield */}
          <path
            d="M 100 70 L 120 80 L 120 110 Q 100 125 100 125 Q 80 125 80 110 L 80 80 Z"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            opacity="0.8"
          />
          {/* Checkmark */}
          <path
            d="M 95 105 L 100 110 L 110 100"
            fill="none"
            stroke={colors.tertiary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </>
      )}

      {cardNumber === 3 && (
        // Research/Network with magnifying glass
        <>
          <circle cx="100" cy="100" r="50" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.4" />
          <circle cx="100" cy="100" r="35" fill="none" stroke={colors.secondary} strokeWidth="1.5" opacity="0.4" />
          <circle cx="100" cy="100" r="20" fill="none" stroke={colors.tertiary} strokeWidth="1.5" opacity="0.4" />
          {/* Magnifying glass */}
          <circle cx="100" cy="85" r="20" fill="none" stroke={colors.primary} strokeWidth="2.5" opacity="0.8" />
          <line x1="110" y1="95" x2="130" y2="115" stroke={colors.primary} strokeWidth="2.5" opacity="0.8" />
          {/* Network nodes */}
          <circle cx="85" cy="115" r="3" fill={colors.secondary} opacity="0.8" />
          <circle cx="115" cy="115" r="3" fill={colors.secondary} opacity="0.8" />
          <circle cx="100" cy="130" r="3" fill={colors.tertiary} opacity="0.8" />
        </>
      )}

      {cardNumber === 4 && (
        // Contributor/Community - interconnected circles
        <>
          <circle cx="70" cy="70" r="18" fill="none" stroke={colors.primary} strokeWidth="2" opacity="0.8" />
          <circle cx="130" cy="70" r="18" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.8" />
          <circle cx="100" cy="125" r="18" fill="none" stroke={colors.tertiary} strokeWidth="2" opacity="0.8" />
          {/* Connection lines */}
          <line x1="85" y1="78" x2="115" y2="78" stroke={colors.primary} strokeWidth="1.5" opacity="0.5" />
          <line x1="75" y1="85" x2="95" y2="110" stroke={colors.secondary} strokeWidth="1.5" opacity="0.5" />
          <line x1="125" y1="85" x2="105" y2="110" stroke={colors.tertiary} strokeWidth="1.5" opacity="0.5" />
          {/* Center dots */}
          <circle cx="70" cy="70" r="4" fill={colors.primary} opacity="0.9" />
          <circle cx="130" cy="70" r="4" fill={colors.secondary} opacity="0.9" />
          <circle cx="100" cy="125" r="4" fill={colors.tertiary} opacity="0.9" />
        </>
      )}
    </svg>
  );
};

// Individual carousel card component
interface CarouselCardProps {
  track: LearningTrack;
  index: number;
  position: "left" | "center" | "right" | "hidden";
}

function CarouselCard({ track, index, position }: CarouselCardProps) {
  const cardNumber = parseInt(track.id === 'fundamentals' ? '0' : track.id === 'eips' ? '1' : track.id === 'governance' ? '2' : track.id === 'research' ? '3' : '4');
  const styles = {
  center: {
    transform:
      "translateX(0px) translateY(-10px) scale(1)",
    opacity: 1,
    zIndex: 30,
  },

  left: {
    transform:
      "translateX(-220px) translateY(10px) scale(0.9)",
    opacity: 0.65,
    zIndex: 20,
  },

  right: {
    transform:
      "translateX(220px) translateY(10px) scale(0.9)",
    opacity: 0.65,
    zIndex: 20,
  },

  hidden: {
    transform: "scale(0.8)",
    opacity: 0,
    zIndex: 0,
    pointerEvents: "none" as const,
  },
};

const style = styles[position];

  return (
    <div
      className="
        absolute
        w-[280px]
        lg:w-[320px]
        h-[450px]
        transition-all
        duration-700
        ease-in-out
      "
      style={style}
    >
      <div
        className={`h-full rounded-2xl border backdrop-blur-sm transition-all duration-700 overflow-hidden relative group ${
          position === "center"
            ? 'bg-card border-emerald-500/30 shadow-2xl'
            : 'bg-muted/40 border-white/10 shadow-lg'
        }`}
        style={
          position === "center"
            ? {
                boxShadow:
                  '0 0 30px rgba(16, 185, 129, 0.2), 0 0 60px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(16, 185, 129, 0.1)',
              }
            : undefined
        }
      >
        {/* Glowing border top */}
        {position === "center" && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent pointer-events-none" />
        )}

        {/* Main content grid */}
        <div className="h-full flex flex-col justify-between p-6 sm:p-8">
          {/* Header with number and level badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {String(index + 1).padStart(2, '0')}
            </div>
            <span
              className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider border rounded-full px-3 py-1 whitespace-nowrap ${
                levelColors[track.level]
              }`}
            >
              {track.level}
            </span>
          </div>

          {/* Illustration - centered */}
          <div className="flex-1 flex items-center justify-center my-4 min-h-[120px] sm:min-h-[140px]">
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
              <IllustrationPlaceholder level={track.level} cardNumber={cardNumber} />
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg sm:text-xl leading-tight">{track.title}</h3>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
              {track.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {track.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[9px] sm:text-[10px] font-medium text-emerald-300/70 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-0.5 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats panel component
function StatsPanel() {
  const stats = [
    { label: 'Paths', value: '5', icon: BookOpen },
    { label: 'Levels', value: '3', icon: FileText },
    { label: 'Possibilities', value: '∞', icon: Search },
  ];

  return (
    <div className="hidden lg:flex flex-row gap-6 absolute right-0 top-15">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const colorClasses =
          idx === 0 ? 'text-emerald-400' : idx === 1 ? 'text-purple-400' : 'text-blue-400';

        return (
          <div key={idx} className="flex items-center gap-3 text-right">
            <div className={`p-2.5 rounded-lg bg-white/5 border border-border ${colorClasses}`}>
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="text-2xl sm:text-3xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// CTA section component
function CTASection() {
  return (
    <div className="mt-16 sm:mt-24 rounded-2xl border border-emerald-500/20 bg-background backdrop-blur-sm p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="flex items-start gap-4 flex-1">
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
          <Star size={20} />
        </div>
        <div>
          <h3 className="text-foreground font-bold text-lg sm:text-xl mb-1">Not sure where to start?</h3>
          <p className="text-gray-400 text-sm sm:text-base">
            Answer a few questions and we'll recommend the perfect learning path for you.
          </p>
        </div>
      </div>
      <button className="flex-shrink-0 px-6 py-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/50 font-semibold text-sm whitespace-nowrap transition-all duration-300 flex items-center gap-2">
        Find My Path
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// Main carousel component
export function LearningTracks() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTracks = learningTracks.length;

  // Auto-scroll logic
  useEffect(() => {
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % totalTracks);
      }, 1500); // 1.5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, totalTracks]);

  // Navigation handlers
  const goToPrevious = () => {
    setActiveIndex((prev) => (prev - 1 + totalTracks) % totalTracks);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalTracks);
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  // Get visible card indices
  const getPosition = (index: number) => {
  const diff = (index - activeIndex + totalTracks) % totalTracks;

  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === totalTracks - 1) return "left";

  return "hidden";
};

  return (
    <section id="learn" className="py-16 sm:py-24 bg-background relative overflow-hidden">
      {/* Subtle top divider glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 relative">
          <div className="max-w-2xl">
            <p className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide uppercase">Learning Paths</p>
            <h2 className="text-foreground font-black text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight mb-4 max-w-xl">
              Your path to Ethereum knowledge starts here
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
              Structured tracks built for learners who want depth - from core Ethereum fundamentals to active protocol participation.
            </p>
          </div>

          {/* Stats Panel */}
          <StatsPanel />
        </div>

        {/* Carousel Container */}
        <div
          className="relative mb-8"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Carousel viewport */}
          <div
            className="
              relative
              h-[500px]
              overflow-hidden
              rounded-2xl
            "
          >
            {/* Visible cards container */}
            <div className="relative w-full h-full flex items-center">
              {/* Carousel Cards */}
              <div className="relative w-full h-full flex items-center justify-center">
                {learningTracks.map((track, idx) => (
                  <CarouselCard
                    key={track.id}
                    track={track}
                    index={idx}
                    position={getPosition(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full border border-emerald-500/30 bg-primary backdrop-blur-sm text-primary-foreground hover:opacity-90 hover:border-emerald-500/50 transition-all duration-300 group hidden sm:flex items-center justify-center"
              aria-label="Previous card"
            >
              <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-30 p-2 rounded-full border border-emerald-500/30 bg-primary backdrop-blur-sm text-primary-foreground hover:opacity-90 hover:border-emerald-500/50 transition-all duration-300 group hidden sm:flex items-center justify-center"
              aria-label="Next card"
            >
              <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Carousel indicators (dots) */}
          <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
            {learningTracks.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === activeIndex
                    ? 'bg-emerald-400 w-2 h-2 sm:w-2.5 sm:h-2.5'
                    : 'bg-gray-600 hover:bg-gray-500 w-1.5 h-1.5 sm:w-2 sm:h-2'
                }`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <CTASection />
      </div>
    </section>
  );
}