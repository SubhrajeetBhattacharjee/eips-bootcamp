// apps/web/components/community/MediaSection.tsx

import React from 'react';
import { Newspaper, ExternalLink, TrendingUp } from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  publication: string;
  date: string;
  type: 'article' | 'interview' | 'publication' | 'feature';
  url?: string;
}

const mediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'ETHShala Launches Campus Ambassador Program',
    publication: 'CoinDesk',
    date: 'May 20, 2024',
    type: 'article',
  },
  {
    id: '2',
    title: 'Interview: Building Web3 Education in India',
    publication: 'The Block',
    date: 'May 15, 2024',
    type: 'interview',
  },
  {
    id: '3',
    title: 'Featured in: Top Web3 Learning Platforms',
    publication: 'Decrypt',
    date: 'May 10, 2024',
    type: 'feature',
  },
  {
    id: '4',
    title: 'Research: Ethereum Education Impact Study',
    publication: 'Ethereum Research',
    date: 'May 5, 2024',
    type: 'publication',
  },
];

const typeColors = {
  article: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  interview: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  publication: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  feature: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
};

export const MediaSection: React.FC = () => {
  return (
    <div className="relative group h-full">
      <div
        className={`
          relative rounded-2xl
          border border-purple-500/30
          bg-gradient-to-br from-purple-500/10 to-purple-500/5
          backdrop-blur-xl
          p-6
          transition-all duration-300
          hover:border-purple-500/60
          hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
          overflow-hidden
          flex flex-col
        `}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br from-purple-400 to-transparent pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📰</span>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
                Media & Press
              </p>
            </div>
            <h3 className="text-2xl font-bold text-foreground mt-1">
              In The News
            </h3>
          </div>

          {/* Media Items List */}
          <div className="space-y-3 flex-1">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className={`
                  rounded-lg border border-border
                  bg-card/60 hover:bg-accent
                  p-4 transition-all duration-200
                  group/media
                `}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.publication}
                    </p>
                  </div>
                  <span
                    className={`
                      text-xs font-medium px-2 py-1 rounded border
                      whitespace-nowrap flex-shrink-0
                      ${typeColors[item.type]}
                    `}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.date}</span>
                  <ExternalLink size={12} className="text-purple-400 opacity-0 group-hover/media:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          {/* <div className="mt-6 pt-4 border-t border-gray-700/50">
            <button
              className={`
                w-full rounded-lg font-medium py-3 px-4
                transition-all duration-200
                border border-purple-500/50 hover:border-purple-500/80
                bg-purple-500/10 hover:bg-purple-500/20
                text-purple-300 hover:text-purple-200
                text-sm flex items-center justify-center gap-2
              `}
            >
              <span>View All Media</span>
              <ExternalLink size={16} />
            </button>
          </div> */}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};