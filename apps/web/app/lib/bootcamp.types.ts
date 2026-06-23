/**
 * ETHShala Module Types
 * TypeScript interfaces and types for ETHShala
 */

export interface InProgressModule {
  id: string;
  title: string;
  moduleName: string;
  progress: number;
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string | null;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  duration: string;
  xpReward: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  type: 'assignment' | 'achievement';
  xp: number;
}

export interface DeadlineItem {
  id: string;
  title: string;
  module: string;
  deadline: string;
}

export interface SkillItem {
  name: string;
  progress: number;
  category: 'technical' | 'soft';
}

export interface StreakItem {
  date: Date;
  intensity: 0 | 1 | 2 | 3 | 4;
}

/**
 * Represents a single module in the bootcamp
 */
export interface Module {
  id: string;
  section: string;
  title: string;
  description: string;
  lessons: number;
  completed: number;
  xpReward: number;
  duration: string;
  color: string; // Tailwind gradient class
}

/**
 * Represents a single lesson within a module
 */
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  description: string;
  content?: LessonContent;
}

/**
 * Detailed lesson content
 */
export interface LessonContent {
  videoUrl?: string;
  transcript?: string;
  keyPoints: string[];
  resources: Resource[];
  exercises?: Exercise[];
}

/**
 * Resource linked to a lesson
 */
export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'document' | 'code' | 'discussion';
  url: string;
  icon: string; // lucide-react icon name
}

/**
 * Exercise or assignment within a lesson
 */
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'coding' | 'writing' | 'submission';
  timeLimit?: number; // in minutes
  maxPoints?: number;
}

/**
 * User progress data
 */
export interface UserProgress {
  userId: string;
  moduleId: string;
  lessonsCompleted: string[];
  exercisesCompleted: string[];
  totalXpEarned: number;
  lastAccessed: Date;
  completedAt?: Date;
}

/**
 * Bootcamp module page props
 */
export interface BootcampPageProps {
  userId?: string;
  includeAnalytics?: boolean;
}

/**
 * Module card props
 */
export interface ModuleCardProps {
  module: Module;
  onClick: () => void;
  isSelected?: boolean;
}

/**
 * Module detail props
 */
export interface ModuleDetailProps {
  module: Module;
  onBack: () => void;
  lessons: Lesson[];
  onLessonComplete?: (lessonId: string) => Promise<void>;
}

/**
 * Sidebar props
 */
export interface BootcampSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  userRole?: 'student' | 'ambassador' | 'admin';
}

/**
 * Topbar props
 */
export interface BootcampTopbarProps {
  xpBalance?: number;
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

/**
 * Bootcamp statistics
 */
export interface BootcampStats {
  totalModules: number;
  modulesCompleted: number;
  modulesInProgress: number;
  totalXpEarned: number;
  totalLessonsCompleted: number;
  streakDays: number;
  leaderboardRank?: number;
}

/**
 * API response types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ModulesApiResponse extends ApiResponse<Module[]> {}
export interface LessonsApiResponse extends ApiResponse<Lesson[]> {}
export interface ProgressApiResponse extends ApiResponse<UserProgress> {}

/**
 * Menu item for sidebar
 */
export interface MenuItem {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

/**
 * Menu section for sidebar
 */
export interface MenuSection {
  section: string;
  items: MenuItem[];
}

/**
 * Notification in topbar
 */
export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}