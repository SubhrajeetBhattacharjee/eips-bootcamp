import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function getDatasourceUrl(): string | undefined {
  let url = process.env.DATABASE_URL || '';
  if (!url) return undefined;

  // If remote PostgreSQL without explicit sslmode, ensure sslmode=disable and connect_timeout
  if (!url.includes('sslmode=') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}sslmode=disable&connect_timeout=10`;
  }
  return url;
}

const datasourceUrl = getDatasourceUrl();

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  });

globalForPrisma.prisma = prisma;
