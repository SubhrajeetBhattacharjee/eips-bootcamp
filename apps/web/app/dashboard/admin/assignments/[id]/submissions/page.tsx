import { fetchSubmissions } from "../../actions";
import SubmissionsClient from "./SubmissionsClient";
import DashboardShell from "@/app/components/dashboard/DashboardShell";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SubmissionsPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  
  if (!user) redirect("/sign-in");
  
  const userRole = (user as any)?.role || 'user';
  if (userRole !== 'admin' && userRole !== 'ADMIN' && user.id !== 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ') {
    redirect("/dashboard");
  }

  const submissions = await fetchSubmissions(params.id);

  return (
    <DashboardShell>
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        <div className="flex-1 overflow-auto">
          <SubmissionsClient submissions={submissions} assignmentId={params.id} />
        </div>
      </div>
    </DashboardShell>
  );
}
