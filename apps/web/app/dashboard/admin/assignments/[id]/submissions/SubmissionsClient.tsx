"use client";

import { useState } from "react";
import { CheckCircle, XCircle, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { gradeSubmission } from "../../actions";
import { useRouter } from "next/navigation";

export default function SubmissionsClient({ submissions, assignmentId }: { submissions: any[], assignmentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGrade(submissionId: string, score: number, status: string, feedback?: string) {
    setLoading(true);
    await gradeSubmission(submissionId, score, status, assignmentId, feedback);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Link href="/dashboard/admin/assignments" className="flex items-center gap-2 text-zinc-400 hover:text-emerald-400 mb-6 transition-colors">
        <ChevronLeft size={18} />
        <span className="text-sm font-medium">Back to Assignments</span>
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Assignment Submissions</h1>
        <p className="text-zinc-400">Review student submissions and award XP</p>
      </div>

      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium text-zinc-300">Student</th>
                <th className="px-6 py-4 font-medium text-zinc-300">Status</th>
                <th className="px-6 py-4 font-medium text-zinc-300">Submission</th>
                <th className="px-6 py-4 font-medium text-zinc-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-white">{sub.user?.name || "Unknown Student"}</div>
                    <div className="text-xs text-zinc-500">{sub.user?.email || sub.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      sub.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sub.content && (sub.content.startsWith('/uploads/') || sub.content.startsWith('http')) ? (
                      <a href={sub.content} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300">
                        <FileText size={16} />
                        View PDF
                      </a>
                    ) : (
                      <span className="text-zinc-500 italic">{sub.content || "No File"}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {sub.status !== 'COMPLETED' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            const score = prompt("Enter XP score for this submission (e.g. 500):", "500");
                            if (score && !isNaN(Number(score))) {
                              const feedback = prompt("Enter remarks/feedback for the student (optional):", "Great job!");
                              handleGrade(sub.id, Number(score), 'COMPLETED', feedback || undefined);
                            }
                          }}
                          disabled={loading}
                          className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve & Grade"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => {
                            const feedback = prompt("Enter reason for rejection:", "Please revise your submission.");
                            if (feedback) {
                              handleGrade(sub.id, 0, 'REJECTED', feedback);
                            }
                          }}
                          disabled={loading}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    )}
                    {sub.status === 'COMPLETED' && (
                      <span className="text-emerald-400 font-bold text-sm">+{sub.score} XP</span>
                    )}
                  </td>
                </tr>
              ))}
              
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No submissions found for this assignment yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
