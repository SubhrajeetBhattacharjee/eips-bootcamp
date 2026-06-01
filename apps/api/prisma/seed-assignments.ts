import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockAssignments = [
  {
    id: 'assign-001',
    title: 'Draft an ERC-20 Token Contract',
    module: 'Structure',
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
    module: 'Examples',
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
    module: 'Writing',
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
    module: 'Structure',
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
    module: 'Advanced',
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
    module: 'Review',
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
    module: 'Examples',
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
    module: 'Writing',
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
    module: 'Advanced',
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
    module: 'Examples',
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
    module: 'Review',
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
    module: 'Writing',
    description: 'Write a formal technical specification for your proposal. Use precise mathematical notation where applicable and ensure complete clarity for implementers.',
    difficulty: 'Advanced',
    xpReward: 250,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    estimatedTime: 4,
    tags: ['Specification', 'Technical', 'Documentation'],
  }
];

async function main() {
  console.log('Seeding Assignments Data...');

  for (const assignment of mockAssignments) {
    await prisma.assignment.upsert({
      where: { id: assignment.id },
      update: assignment,
      create: assignment,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
