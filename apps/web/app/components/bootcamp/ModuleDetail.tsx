'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  Clock,
  Zap,
  Book,
  FileText,
  PlayCircle,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  description: string;
  content?: string;
}

interface Module {
  id: string;
  section: string;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  xpReward: number;
  duration: string;
  color: string;
}

interface ModuleDetailProps {
  module: Module;
  onBack: () => void;
  lessons: Lesson[];
  onLessonComplete?: (lessonId: string) => void;
}

export function ModuleDetail({ module, onBack, lessons, onLessonComplete }: ModuleDetailProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const selectedLessonData = lessons.find(l => l.id === selectedLesson);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar - Lessons List */}
      <div className="w-96 bg-gradient-to-b from-gray-950 via-black to-black border-r border-gray-800 flex flex-col overflow-hidden">
        {/* Module Header */}
        <div className="p-6 border-b border-gray-800">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-4"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-medium">Back to Modules</span>
          </button>

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Book size={24} className="text-black" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mt-1">{module.title}</h2>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-300">Progress</span>
            <span className="text-sm font-bold text-emerald-400">
              {module.completed}/{module.lessons}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
              style={{ width: `${module.lessons > 0 ? (module.completed / module.lessons) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {lessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson.id)}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                selectedLesson === lesson.id
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30'
                  : 'bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {lesson.completed ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-400/30"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Lesson {idx + 1}
                  </div>
                  <h4 className="text-sm font-semibold text-white mt-1 line-clamp-2">
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock size={12} />
                    {lesson.duration}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Module Stats */}
        <div className="p-4 border-t border-gray-800 space-y-3 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total Duration</span>
            <span className="font-semibold text-white flex items-center gap-1">
              <Clock size={14} className="text-emerald-400" />
              {module.duration}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total XP</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Zap size={14} />
              {module.xpReward}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-black">
        {selectedLessonData ? (
          <LessonContent 
            lesson={selectedLessonData} 
            moduleTitle={module.title} 
            onLessonComplete={onLessonComplete}
          />
        ) : (
          <ModuleOverview module={module} lessons={lessons} />
        )}
      </div>
    </div>
  );
}

function ModuleOverview({ module, lessons }: { module: Module; lessons: Lesson[] }) {
  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-white mb-3">
          {module.title}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">{module.description}</p>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <span className="text-sm font-bold text-emerald-400">{idx + 1}</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{lesson.title}</h3>
                <p className="text-gray-400 text-sm">{lesson.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/5 border border-cyan-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-gray-400 mb-6">
          Click on the first lesson to begin this module. You can progress through lessons at your own pace.
        </p>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-semibold rounded-lg transition-all">
          <PlayCircle size={20} />
          Start Module
        </button>
      </div>
    </div>
  );
}

function LessonContent({ lesson, moduleTitle, onLessonComplete }: { lesson: Lesson; moduleTitle: string; onLessonComplete?: (id: string) => Promise<void> | void }) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    if (!onLessonComplete || isCompleting) return;
    setIsCompleting(true);
    await onLessonComplete(lesson.id);
    setIsCompleting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
        <span>{moduleTitle}</span>
        <ChevronRight size={16} />
        <span className="text-emerald-400">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-5xl font-bold text-white flex-1">{lesson.title}</h1>
          {lesson.completed && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <Check size={18} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">Completed</span>
            </div>
          )}
        </div>
        <p className="text-gray-400 flex items-center gap-2">
          <Clock size={16} className="text-emerald-400" />
          {lesson.duration}
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {/* Video or Image */}
        {(() => {
          let videoUrl = '';
          let thumbnailUrl = '';
          let textContent = lesson.content || lesson.description;

          if (lesson.content) {
            try {
              const parsed = JSON.parse(lesson.content);
              videoUrl = parsed.videoUrl || '';
              thumbnailUrl = parsed.thumbnailUrl || '';
              textContent = parsed.text || lesson.description;
            } catch (e) {
              // Not JSON, assume it's just raw text
            }
          }

          // Convert youtube watch links to embed links
          let embedUrl = videoUrl;
          if (videoUrl.includes('youtube.com/watch?v=')) {
            embedUrl = videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
            // Remove any other query params like &t=...
            embedUrl = embedUrl.split('&')[0];
            embedUrl += '?modestbranding=1&rel=0&controls=1&disablekb=1';
          } else if (videoUrl.includes('youtu.be/')) {
            embedUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
            embedUrl += '?modestbranding=1&rel=0&controls=1&disablekb=1';
          } else if (videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('vimeo')) {
            // It's a direct video link, use native HTML5 player
            return (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <video 
                  src={videoUrl}
                  controls
                  controlsList="nodownload"
                  poster={thumbnailUrl}
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }

          if (embedUrl) {
            return (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <iframe 
                  src={embedUrl} 
                  title={lesson.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          } else if (thumbnailUrl) {
            return (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img src={thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover" />
              </div>
            );
          } else {
            return (
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-64">
                <PlayCircle size={64} className="text-emerald-400/30 mb-4" />
                <p className="text-gray-400 text-center">No video available for this lesson</p>
              </div>
            );
          }
        })()}

        {/* Description / Content Text */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
          <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap font-sans">
            {(() => {
              try {
                if (lesson.content) {
                  const parsed = JSON.parse(lesson.content);
                  return parsed.text || lesson.description;
                }
              } catch (e) {}
              return lesson.content || lesson.description;
            })()}
          </div>
        </div>

        {/* Key Points */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Key Points</h2>
          <ul className="space-y-4">
            {[
              'Understand the core concept and its importance',
              'Learn best practices and practical applications',
              'Explore real-world examples and use cases',
              'Practice implementation with exercises',
            ].map((point, idx) => (
              <li key={idx} className="flex gap-3">
                <Check size={20} className="text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Resources</h2>
          <div className="space-y-3">
            {[
              { title: 'EIP Standard Reference', icon: FileText },
              { title: 'Code Examples & Templates', icon: Code },
              { title: 'Discussion Forum', icon: MessageCircle },
            ].map((resource, idx) => (
              <button
                key={idx}
                className="w-full flex items-center gap-3 p-4 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl transition-all text-left"
              >
                <resource.icon size={20} className="text-emerald-400 flex-shrink-0" />
                <span className="font-medium text-white flex-1">{resource.title}</span>
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {!lesson.completed && (
          <div className="flex gap-4 pt-8 border-t border-gray-800">
            <button 
              onClick={handleComplete}
              disabled={isCompleting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCompleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Mark as Complete & Claim XP
                </>
              )}
            </button>
            <button 
              onClick={() => alert('Progress is automatically saved as you watch!')}
              className="px-6 py-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <Clock size={18} />
              Save Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Icon placeholders (in real project, import from lucide-react)
const Code = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const MessageCircle = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);