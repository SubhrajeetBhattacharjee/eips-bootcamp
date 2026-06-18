import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const modules = [
  {
    id: '1',
    title: 'Introduction to EIPs',
    description: 'Learn the fundamentals of Ethereum Improvement Proposals and their role in the ecosystem.',
    xpReward: 150,
    duration: '45 min',
    color: 'from-emerald-500/20 to-emerald-600/10',
    orderIndex: 1,
    category: 'Beginner',
    isPremium: false,
    thumbnailUrl: '/brand/ethshala_logo.svg',
    lessons: [
      { id: '1.1', title: 'What is an EIP?', duration: '12 min', description: 'Understand the definition and purpose of Ethereum Improvement Proposals', orderIndex: 1 },
      { id: '1.2', title: 'EIP Categories and Types', duration: '15 min', description: 'Explore different types of EIPs: Core, Networking, Interface, etc.', orderIndex: 2 },
      { id: '1.3', title: 'Why EIPs Matter', duration: '18 min', description: 'Learn how EIPs shape the future of Ethereum', orderIndex: 3 },
    ],
  },
  {
    id: '2',
    title: 'EIP Structure & Components',
    description: 'Master the anatomy of a well-written EIP including all required sections and formatting standards.',
    xpReward: 200,
    duration: '1 hour',
    color: 'from-cyan-500/20 to-cyan-600/10',
    orderIndex: 2,
    category: 'Intermediate',
    isPremium: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=2832&auto=format&fit=crop',
    lessons: [
      { id: '2.1', title: 'Required Sections Overview', duration: '14 min', description: 'Understand all required sections in an EIP document', orderIndex: 1 },
      { id: '2.2', title: 'Header and Metadata', duration: '16 min', description: 'Format EIP headers and YAML metadata correctly', orderIndex: 2 },
      { id: '2.3', title: 'Motivation and Specification', duration: '20 min', description: 'Write compelling motivation and technical specifications', orderIndex: 3 },
      { id: '2.4', title: 'Rationale and Implementation', duration: '18 min', description: 'Explain design decisions and implementation details', orderIndex: 4 },
    ],
  },
  {
    id: '3',
    title: 'Writing Clear Specifications',
    description: 'Develop the skills to write precise and unambiguous technical specifications that meet EIP standards.',
    xpReward: 250,
    duration: '1.5 hours',
    color: 'from-blue-500/20 to-blue-600/10',
    orderIndex: 3,
    category: 'Intermediate',
    isPremium: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=2832&auto=format&fit=crop',
    lessons: [
      { id: '3.1', title: 'Abstract Best Practices', duration: '13 min', description: 'Write concise, effective abstracts', orderIndex: 1 },
      { id: '3.2', title: 'Motivation: Tell the Story', duration: '15 min', description: 'Craft a compelling problem statement', orderIndex: 2 },
      { id: '3.3', title: 'Technical Precision', duration: '17 min', description: 'Write unambiguous technical specifications', orderIndex: 3 },
      { id: '3.4', title: 'Rationale: Explain Why', duration: '16 min', description: 'Document your design decisions', orderIndex: 4 },
      { id: '3.5', title: 'Security Considerations', duration: '20 min', description: 'Address potential security implications', orderIndex: 5 },
    ],
  },
  {
    id: '4',
    title: 'EIP Review Process',
    description: 'Understand the peer review cycle, community feedback, and the path to EIP acceptance.',
    xpReward: 200,
    duration: '1 hour',
    color: 'from-violet-500/20 to-violet-600/10',
    orderIndex: 4,
    category: 'Advanced',
    isPremium: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=2832&auto=format&fit=crop',
    lessons: [
      { id: '4.1', title: 'Submitting an EIP', duration: '14 min', description: 'Navigate the submission process', orderIndex: 1 },
      { id: '4.2', title: 'Community Feedback', duration: '18 min', description: 'Incorporate community comments effectively', orderIndex: 2 },
      { id: '4.3', title: 'From Draft to Final', duration: '16 min', description: 'Understand the EIP lifecycle and approval process', orderIndex: 3 },
    ],
  },
  {
    id: '5',
    title: 'Real-World EIP Examples',
    description: 'Analyze successful EIPs across different categories and learn from best practices.',
    xpReward: 300,
    duration: '2 hours',
    color: 'from-pink-500/20 to-pink-600/10',
    orderIndex: 5,
    category: 'Intermediate',
    isPremium: true,
    price: 100,
    thumbnailUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop',
    lessons: [
      { id: '5.1', title: 'Analyzing EIP-1559', duration: '22 min', description: 'Deep dive into a major EIP that changed Ethereum', orderIndex: 1 },
      { id: '5.2', title: 'Token Standards: EIP-20 & EIP-721', duration: '25 min', description: 'Learn from the most successful EIPs', orderIndex: 2 },
      { id: '5.3', title: 'Case Study: Protocol Upgrades', duration: '20 min', description: 'How EIPs drive major protocol changes', orderIndex: 3 },
      { id: '5.4', title: 'Case Study: Standards & Extensions', duration: '18 min', description: 'Standards that shaped the Web3 ecosystem', orderIndex: 4 },
    ],
  },
  {
    id: '6',
    title: 'Advanced Topics & Security',
    description: 'Explore advanced EIP concepts including security considerations and consensus mechanisms.',
    xpReward: 350,
    duration: '2.5 hours',
    color: 'from-orange-500/20 to-orange-600/10',
    orderIndex: 6,
    category: 'Advanced',
    isPremium: true,
    price: 150,
    thumbnailUrl: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=2832&auto=format&fit=crop',
    lessons: [
      { id: '6.1', title: 'Consensus and Finality', duration: '24 min', description: 'Advanced consensus mechanisms in EIPs', orderIndex: 1 },
      { id: '6.2', title: 'Security Analysis Deep Dive', duration: '28 min', description: 'Comprehensive security considerations', orderIndex: 2 },
      { id: '6.3', title: 'Formal Verification', duration: '26 min', description: 'Mathematical proofs for EIP specifications', orderIndex: 3 },
      { id: '6.4', title: 'Performance & Scalability', duration: '22 min', description: 'Optimize EIPs for network efficiency', orderIndex: 4 },
      { id: '6.5', title: 'Contributing to Ethereum', duration: '20 min', description: 'Your path forward as an EIP contributor', orderIndex: 5 },
    ],
  },
];

const mockAssignments = [
  {
    id: 'assign-001',
    title: 'Draft an ERC-20 Token Contract',
    module: '2', // EIP Structure & Components
    description: 'Create a complete ERC-20 token implementation following the standard specification. Include proper events, error handling, and security considerations.',
    difficulty: 'Intermediate',
    xpReward: 200,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedTime: 3,
    tags: ['Smart Contracts', 'Solidity', 'Standards'],
  },
  {
    id: 'assign-002',
    title: 'Analyze EIP-1559 Architecture',
    module: '5', // Real-World EIP Examples
    description: 'Write a detailed analysis of EIP-1559 including its impact on transaction fees, MEV implications, and implementation considerations across different clients.',
    difficulty: 'Advanced',
    xpReward: 300,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    estimatedTime: 4,
    tags: ['Analysis', 'Protocol', 'Economics'],
  },
  {
    id: 'assign-003',
    title: 'Write Motivation Section for EIP',
    module: '3', // Writing Clear Specifications
    description: 'Draft a compelling motivation section for a proposed Ethereum Improvement Proposal. Focus on clearly articulating the problem, its impact, and why your solution is necessary.',
    difficulty: 'Beginner',
    xpReward: 100,
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    estimatedTime: 1.5,
    tags: ['Writing', 'Documentation', 'Proposal'],
  },
  {
    id: 'assign-004',
    title: 'Create EIP Metadata Specification',
    module: '2', // EIP Structure & Components
    description: 'Create a complete metadata specification for an EIP proposal, including proper headers, status markers, and YAML formatting. Ensure all required fields are present.',
    difficulty: 'Beginner',
    xpReward: 75,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    estimatedTime: 1,
    tags: ['Documentation', 'Formatting', 'Metadata'],
  },
  {
    id: 'assign-005',
    title: 'Security Analysis & Threat Model',
    module: '6', // Advanced Topics & Security
    description: 'Conduct a comprehensive security analysis of a proposed protocol change. Include threat modeling, edge cases, and mitigation strategies.',
    difficulty: 'Advanced',
    xpReward: 350,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    estimatedTime: 5,
    tags: ['Security', 'Analysis', 'Protocol'],
  },
  {
    id: 'assign-006',
    title: 'Governance Discussion Summary',
    module: '4', // EIP Review Process
    description: 'Summarize community discussion on a proposed EIP, including key arguments for and against, consensus areas, and outstanding questions.',
    difficulty: 'Intermediate',
    xpReward: 150,
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    estimatedTime: 2,
    tags: ['Governance', 'Community', 'Discussion'],
  },
  {
    id: 'assign-007',
    title: 'Implement Protocol Upgrade Simulation',
    module: '5', // Real-World EIP Examples
    description: 'Create a simulation or proof-of-concept demonstrating how a proposed protocol change would function in practice. Include performance metrics and edge cases.',
    difficulty: 'Advanced',
    xpReward: 400,
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    estimatedTime: 6,
    tags: ['Implementation', 'Simulation', 'Protocol'],
  },
  {
    id: 'assign-008',
    title: 'EIP Rationale Documentation',
    module: '3', // Writing Clear Specifications
    description: 'Document the design decisions and rationale behind your proposed EIP. Explain alternative approaches considered and why the chosen solution is optimal.',
    difficulty: 'Intermediate',
    xpReward: 200,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedTime: 2.5,
    tags: ['Documentation', 'Design', 'Rationale'],
  },
  {
    id: 'assign-009',
    title: 'Consensus Mechanism Analysis',
    module: '6', // Advanced Topics & Security
    description: 'Analyze consensus implications of a proposed change. Include PoW vs PoS considerations, finality guarantees, and network security implications.',
    difficulty: 'Advanced',
    xpReward: 300,
    deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    estimatedTime: 4,
    tags: ['Consensus', 'Security', 'Protocol'],
  },
  {
    id: 'assign-010',
    title: 'Client Implementation Guide',
    module: '5', // Real-World EIP Examples
    description: 'Create a comprehensive guide for implementing a proposed EIP across different Ethereum clients. Include code examples and compatibility considerations.',
    difficulty: 'Advanced',
    xpReward: 350,
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    estimatedTime: 5,
    tags: ['Implementation', 'Clients', 'Documentation'],
  },
  {
    id: 'assign-011',
    title: 'Backwards Compatibility Review',
    module: '4', // EIP Review Process
    description: 'Conduct a thorough review of backward compatibility implications. Document breaking changes and upgrade paths for affected systems.',
    difficulty: 'Intermediate',
    xpReward: 175,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    estimatedTime: 2.5,
    tags: ['Compatibility', 'Protocol', 'Review'],
  },
  {
    id: 'assign-012',
    title: 'Formal Specification Draft',
    module: '3', // Writing Clear Specifications
    description: 'Write a formal technical specification for your proposal. Use precise mathematical notation where applicable and ensure complete clarity for implementers.',
    difficulty: 'Advanced',
    xpReward: 250,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    estimatedTime: 4,
    tags: ['Specification', 'Technical', 'Documentation'],
  }
];

const mockRewards = [
  {
    id: 'hoodie',
    title: 'EthShala Hoodie',
    description: 'Premium hoodie for true Ethereum builders.',
    cost: 1200,
    category: 'merchandise',
    badge: 'MERCH',
    image: '🎽',
    available: true,
  },
  {
    id: 'genesis-nft',
    title: 'Genesis Role NFT',
    description: 'Exclusive NFT for early EthShala contributors.',
    cost: 2000,
    category: 'nfts',
    badge: 'NFT',
    image: '◆',
    available: true,
  },
  {
    id: 'pro-pass',
    title: 'EthShala Pro Pass',
    description: 'Unlock premium courses and exclusive content.',
    cost: 1500,
    category: 'experiences',
    badge: 'ACCESS',
    image: '🔑',
    available: true,
  },
  {
    id: 'cap',
    title: 'EthShala Cap',
    description: 'Limited edition cap representing your journey.',
    cost: 800,
    category: 'merchandise',
    badge: 'MERCH',
    image: '🧢',
    available: true,
  },
  {
    id: 'live-session',
    title: 'Live Workshop Access',
    description: 'Join exclusive live sessions with Ethereum experts.',
    cost: 1000,
    category: 'experiences',
    badge: 'EXPERIENCE',
    image: '🎤',
    available: true,
  },
  {
    id: 'og-nft',
    title: 'OG Contributor NFT',
    description: 'Special NFT for top contributors.',
    cost: 3000,
    category: 'nfts',
    badge: 'NFT',
    image: '◆',
    available: true,
  },
  {
    id: 'discord-role',
    title: 'Private Discord Role',
    description: 'Get exclusive Discord role in our community.',
    cost: 600,
    category: 'community',
    badge: 'ACCESS',
    image: '💬',
    available: true,
  },
  {
    id: 'mug',
    title: 'EthShala Mug',
    description: 'Sip your coffee in style with our branded mug.',
    cost: 500,
    category: 'merchandise',
    badge: 'MERCH',
    image: '☕',
    available: true,
  },
];

async function main() {
  console.log('🚀 Starting Seeding...');

  // 1. Seed Modules and Lessons
  console.log('📦 Seeding Modules and Lessons...');
  for (const module of modules) {
    const { lessons, ...moduleData } = module;
    
    const createdModule = await prisma.module.upsert({
      where: { id: module.id },
      update: moduleData,
      create: moduleData,
    });

    for (const lesson of lessons) {
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: { ...lesson, moduleId: createdModule.id },
        create: { ...lesson, moduleId: createdModule.id },
      });
    }
  }

  // 2. Seed Assignments
  console.log('📝 Seeding Assignments...');
  for (const assignment of mockAssignments) {
    await prisma.assignment.upsert({
      where: { id: assignment.id },
      update: assignment,
      create: assignment,
    });
  }

  // 3. Seed Rewards
  console.log('🎁 Seeding Rewards...');
  for (const reward of mockRewards) {
    await prisma.reward.upsert({
      where: { id: reward.id },
      update: reward,
      create: reward,
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
