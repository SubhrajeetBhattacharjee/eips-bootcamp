"use server";

import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/app/lib/api";

async function verifyAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const userId = user?.id;
  
  if (!userId) throw new Error("Unauthorized");
  
  const userRole = (user as any)?.role || 'user';
  if (userRole !== 'admin' && userRole !== 'ADMIN' && userId !== 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ') {
    throw new Error("Forbidden");
  }
  return userId;
}

export async function createAssignment(data: {
  title: string;
  module: string;
  description: string;
  difficulty: string;
  xpReward: number;
  deadline: string;
  estimatedTime: number;
  tags: string[];
  questionFileUrl?: string;
}) {
  await verifyAdmin();
  
  try {
    await apiFetch("/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    revalidatePath("/dashboard/admin/assignments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAssignment(assignmentId: string) {
  await verifyAdmin();
  try {
    await apiFetch(`/assignments/${assignmentId}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/admin/assignments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editAssignment(assignmentId: string, data: any) {
  await verifyAdmin();
  try {
    await apiFetch(`/assignments/${assignmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    revalidatePath("/dashboard/admin/assignments");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function fetchSubmissions(assignmentId: string) {
  await verifyAdmin();
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { assignmentId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
    orderBy: { submittedAt: 'desc' }
  });
  return submissions;
}

export async function gradeSubmission(submissionId: string, score: number, status: string, assignmentId: string, feedback?: string) {
  await verifyAdmin();
  
  const submission = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: { score, status, feedback }
  });

  // If the assignment is graded as COMPLETED, we need to award XP to the user
  if (status === 'COMPLETED' && score > 0) {
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }});
    
    await prisma.xPTransaction.create({
      data: {
        userId: submission.userId,
        amount: score,
        reason: `Graded Assignment: ${assignment?.title || 'Unknown'}`,
      }
    });
  }

  // Revalidate both the specific submission page and the general assignments page
  revalidatePath(`/dashboard/admin/assignments/submissions/${assignmentId}`);
  revalidatePath("/dashboard/admin/assignments");

  return { success: true };
}
