// ─────────────────────────────────────────────
// EthShala — Landing page data
// ─────────────────────────────────────────────

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: 'book' | 'file-text' | 'vote' | 'search' | 'git-branch';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface JourneyStep {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: 'compass' | 'book-open' | 'users' | 'git-commit';
}

export interface WhyCard {
  id: string;
  title: string;
  description: string;
  icon: 'layers' | 'shield' | 'activity' | 'globe';
}

export const learningTracks: LearningTrack[] = [
  {
    id: 'fundamentals',
    title: 'Ethereum Fundamentals',
    description: 'Understand the architecture, consensus, and core principles powering the Ethereum protocol.',
    tags: ['Architecture', 'Consensus', 'PoS'],
    icon: 'book',
    level: 'Beginner',
  },
  {
    id: 'eips',
    title: 'Understanding EIPs',
    description: 'Deep dive into Ethereum Improvement Proposals — how they are written, reviewed, and finalized.',
    tags: ['ERC', 'Core EIPs', 'Process'],
    icon: 'file-text',
    level: 'Intermediate',
  },
  {
    id: 'governance',
    title: 'Governance & Decision Making',
    description: 'Learn how Ethereum governance works — from All Core Devs calls to rough consensus.',
    tags: ['ACD', 'Rough Consensus', 'Signaling'],
    icon: 'vote',
    level: 'Intermediate',
  },
  {
    id: 'research',
    title: 'Protocol Research',
    description: 'Explore active Ethereum research areas including scaling, cryptography, and execution layer upgrades.',
    tags: ['Verkle Trees', 'PeerDAS', 'EOF'],
    icon: 'search',
    level: 'Advanced',
  },
  {
    id: 'contributor',
    title: 'Contributor Journey',
    description: 'A guided path from learner to active Ethereum ecosystem contributor — step by step.',
    tags: ['Open Source', 'GitHub', 'Community'],
    icon: 'git-branch',
    level: 'Beginner',
  },
];

export const journeySteps: JourneyStep[] = [
  {
    id: 'discover',
    step: '01',
    title: 'Discover',
    description: 'Explore Ethereum architecture, EIPs, and the governance landscape through structured modules.',
    icon: 'compass',
  },
  {
    id: 'learn',
    step: '02',
    title: 'Learn',
    description: 'Work through curated learning paths built by contributors who understand the protocol deeply.',
    icon: 'book-open',
  },
  {
    id: 'participate',
    step: '03',
    title: 'Participate',
    description: 'Engage with the community, join discussions, follow ACD calls, and track live EIPs.',
    icon: 'users',
  },
  {
    id: 'contribute',
    step: '04',
    title: 'Contribute',
    description: 'Take your knowledge into the ecosystem — review EIPs, write proposals, mentor others.',
    icon: 'git-commit',
  },
];

export const whyCards: WhyCard[] = [
  {
    id: 'evolving',
    title: 'Ethereum Evolves Through Proposals',
    description: 'Every major change to Ethereum — from EIP-1559 to The Merge — began as a written proposal. Understanding this process is foundational.',
    icon: 'layers',
  },
  {
    id: 'governance',
    title: 'Governance Is Underrepresented',
    description: 'Most Ethereum education focuses on development. EthShala Bootcamp fills the gap for those who want to understand the protocol layer.',
    icon: 'shield',
  },
  {
    id: 'active',
    title: 'The Ecosystem Is Actively Changing',
    description: 'Verkle Trees, PeerDAS, EOF — upgrades are happening now. Stay informed and understand what is being built and why.',
    icon: 'activity',
  },
  {
    id: 'impact',
    title: 'Contributors Shape the Future',
    description: 'The Ethereum protocol is shaped by people who show up, read carefully, and participate thoughtfully. That can be you.',
    icon: 'globe',
  },
];

export const navLinks = [
  { label: 'Learn', href: '/#learn' },
  { label: 'EIPs', href: '/#eips' },
  { label: 'Governance', href: '/#governance' },
  { label: 'Community', href: '/#community' },
  { label: 'About', href: '/about' },
];

export const footerLinks = {
  joinUs: [
    // Add Discord invite later when specific channel is created.
    { label: 'Discord', href: '#' },
  ],
  important: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Marketplace', href: '/dashboard/marketplace' },
    { label: 'My Learning', href: '/dashboard/learning' },
    { label: 'Referrals', href: '/dashboard/referrals' },
    { label: 'About Us', href: '/about' },
  ],
  followUs: [
    { label: 'YouTube', href: 'https://www.youtube.com/@etherworldco' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ethshala' },
    { label: 'X', href: 'https://x.com/EthShala' },
    { label: 'EtherWorld', href: 'https://etherworld.co/' },
  ],
};
