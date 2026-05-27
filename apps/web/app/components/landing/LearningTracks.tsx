import { BookOpen, FileText, Vote, Search, GitBranch } from 'lucide-react';
import { learningTracks, type LearningTrack } from '../../lib/landing-data';

const levelColors: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

const iconMap: Record<LearningTrack['icon'], React.ReactNode> = {
  book: <BookOpen size={22} />,
  'file-text': <FileText size={22} />,
  vote: <Vote size={22} />,
  search: <Search size={22} />,
  'git-branch': <GitBranch size={22} />,
};

function TrackCard({ track }: { track: LearningTrack }) {
  return (
    <div className="group relative bg-[#0d0d0d] border border-white/7 rounded-2xl p-6 flex flex-col gap-4 hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300 cursor-default overflow-hidden">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/2 transition-all duration-300 rounded-2xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/20 to-transparent transition-all duration-500 pointer-events-none" />

      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative z-10">
        {iconMap[track.icon]}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white font-bold text-base leading-tight">{track.title}</h3>
          <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${levelColors[track.level]}`}>
            {track.level}
          </span>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">{track.description}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 relative z-10">
        {track.tags.map((tag: string) => (
          <span
            key={tag}
            className="text-[10.5px] font-medium text-zinc-500 bg-white/4 border border-white/6 rounded-lg px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function LearningTracks() {
  return (
    <section id="learn" className="py-24 bg-[#080808] relative overflow-hidden">
      {/* Subtle top divider glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 max-w-xl">
          <p className="text-emerald-400 text-sm font-semibold mb-3 tracking-wide">Learning Paths</p>
          <h2 className="text-white font-black text-4xl leading-tight tracking-tight mb-4">
            Your path to Ethereum knowledge starts here
          </h2>
          <p className="text-zinc-500 text-base leading-relaxed">
            Structured tracks built for learners who want depth — from core Ethereum fundamentals to active protocol participation.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningTracks.slice(0, 3).map((track: LearningTrack) => (
            <TrackCard key={track.id} track={track} />
          ))}
          {/* Last 2 centered on a row */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:max-w-[66%] lg:mx-auto w-full">
            {learningTracks.slice(3).map((track: LearningTrack) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}