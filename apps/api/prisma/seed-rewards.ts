import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockRewards = [
  {
    id: 'hoodie',
    title: 'EIPsInsight Hoodie',
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
    description: 'Exclusive NFT for early EIPsInsight contributors.',
    cost: 2000,
    category: 'nfts',
    badge: 'NFT',
    image: '◆',
    available: true,
  },
  {
    id: 'pro-pass',
    title: 'EIPsInsight Pro Pass',
    description: 'Unlock premium courses and exclusive content.',
    cost: 1500,
    category: 'experiences',
    badge: 'ACCESS',
    image: '🔑',
    available: true,
  },
  {
    id: 'cap',
    title: 'EIPsInsight Cap',
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
    title: 'EIPsInsight Mug',
    description: 'Sip your coffee in style with our branded mug.',
    cost: 500,
    category: 'merchandise',
    badge: 'MERCH',
    image: '☕',
    available: true,
  },
];

async function main() {
  console.log('Seeding Rewards Data...');

  for (const reward of mockRewards) {
    await prisma.reward.upsert({
      where: { id: reward.id },
      update: reward,
      create: reward,
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
