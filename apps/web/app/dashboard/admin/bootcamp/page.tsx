import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import EthShalaAdminClient from "./EthShalaAdminClient";

export const metadata = {
  title: "Manage EthShala | Admin",
};

export default async function AdminEthShalaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user?.id) {
    redirect("/sign-in");
  }

  const userRole = (user as any).role || 'user';
  if (userRole !== 'ADMIN' && userRole !== 'admin' && user.id !== 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ') {
    redirect("/dashboard");
  }

  const userId = user.id;

  // Fetch all modules. We pass the admin's userId just to satisfy the endpoint,
  // but we only care about the module data itself.
  let modules: any[] = []; // keeping any for now since it comes from untyped API helper
  try {
    modules = await apiFetch(`/bootcamp/modules/${userId}`);
  } catch (error) {
    console.error("Failed to fetch modules:", error);
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">EthShala Management</h1>
            <p className="text-muted-foreground text-sm">Create and organize learning modules and lessons.</p>
          </div>
        </div>

        <EthShalaAdminClient initialModules={modules} />
      </div>
    </DashboardShell>
  );
}
