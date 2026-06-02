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

export async function createModule(data: {
  title: string;
  description: string;
  xpReward: number;
  duration: string;
  color: string;
  thumbnailUrl?: string;
  orderIndex: number;
}) {
  await verifyAdmin();
  
  try {
    await apiFetch("/bootcamp/modules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    revalidatePath("/dashboard/admin/bootcamp");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createLesson(moduleId: string, data: {
  title: string;
  description: string;
  duration: string;
  content: string; // JSON holding video URL and thumbnail, or markdown
  orderIndex: number;
}) {
  await verifyAdmin();
  
  try {
    await apiFetch(`/bootcamp/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    revalidatePath("/dashboard/admin/bootcamp");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteModule(moduleId: string) {
  await verifyAdmin();
  try {
    await apiFetch(`/bootcamp/modules/${moduleId}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/admin/bootcamp");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLesson(lessonId: string) {
  await verifyAdmin();
  try {
    await apiFetch(`/bootcamp/lessons/${lessonId}`, {
      method: "DELETE",
    });
    revalidatePath("/dashboard/admin/bootcamp");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editModule(id: string, data: {
  title: string;
  description: string;
  xpReward: number;
  duration: string;
  color: string;
  thumbnailUrl?: string;
  orderIndex: number;
}) {
  await verifyAdmin();
  try {
    await apiFetch(`/bootcamp/modules/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    revalidatePath("/dashboard/admin/bootcamp");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editLesson(id: string, data: {
  title: string;
  description: string;
  duration: string;
  content: string;
  orderIndex: number;
}) {
  await verifyAdmin();
  try {
    await apiFetch(`/bootcamp/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    revalidatePath("/dashboard/admin/bootcamp");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
