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
    lessons: [
      { id: '6.1', title: 'Consensus and Finality', duration: '24 min', description: 'Advanced consensus mechanisms in EIPs', orderIndex: 1 },
      { id: '6.2', title: 'Security Analysis Deep Dive', duration: '28 min', description: 'Comprehensive security considerations', orderIndex: 2 },
      { id: '6.3', title: 'Formal Verification', duration: '26 min', description: 'Mathematical proofs for EIP specifications', orderIndex: 3 },
      { id: '6.4', title: 'Performance & Scalability', duration: '22 min', description: 'Optimize EIPs for network efficiency', orderIndex: 4 },
      { id: '6.5', title: 'Contributing to Ethereum', duration: '20 min', description: 'Your path forward as an EIP contributor', orderIndex: 5 },
    ],
  },
];

async function main() {
  console.log('Seeding Bootcamp Data...');

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
