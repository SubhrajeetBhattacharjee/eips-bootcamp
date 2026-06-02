"use client";

import { useState } from "react";
import { Plus, FileText, Calendar, Tag as TagIcon, Signal, Trash2, AlertTriangle, Download } from "lucide-react";
import { createAssignment, deleteAssignment, editAssignment } from "./actions";
import { useRouter } from "next/navigation";

export default function AssignmentsAdminClient({ initialAssignments }: { initialAssignments: any[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingAssignment, setDeletingAssignment] = useState<{ id: string; title: string } | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFileUpload(file: File | null) {
    if (!file) return undefined;
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) throw new Error("Failed to upload file");
    const data = await res.json();
    return data.fileUrl;
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const tagsString = formData.get("tags") as string;
      const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
      
      const file = formData.get("questionFile") as File;
      const fileUrl = file && file.size > 0 ? await handleFileUpload(file) : undefined;
      
      await createAssignment({
        title: formData.get("title") as string,
        module: formData.get("module") as string,
        description: formData.get("description") as string,
        difficulty: formData.get("difficulty") as string,
        xpReward: Number(formData.get("xpReward")),
        deadline: formData.get("deadline") as string,
        estimatedTime: Number(formData.get("estimatedTime")),
        tags,
        questionFileUrl: fileUrl,
      });

      setIsCreating(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error creating assignment");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deletingAssignment) return;
    setLoading(true);
    await deleteAssignment(deletingAssignment.id);
    setLoading(false);
    setDeletingAssignment(null);
    router.refresh();
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingAssignment) return;
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const tagsString = formData.get("tags") as string;
      const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
      
      const file = formData.get("questionFile") as File;
      const fileUrl = file && file.size > 0 ? await handleFileUpload(file) : editingAssignment.questionFileUrl;
      
      await editAssignment(editingAssignment.id, {
        title: formData.get("title") as string,
        module: formData.get("module") as string,
        description: formData.get("description") as string,
        difficulty: formData.get("difficulty") as string,
        xpReward: Number(formData.get("xpReward")),
        deadline: formData.get("deadline") as string,
        estimatedTime: Number(formData.get("estimatedTime")),
        tags,
        questionFileUrl: fileUrl,
      });

      setEditingAssignment(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving assignment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold rounded-lg transition-colors"
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {initialAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-5 flex-1 relative group">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {assignment.module}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                    {assignment.xpReward} XP
                  </span>
                  <button
                    onClick={() => setEditingAssignment(assignment)}
                    className="p-1.5 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit Assignment"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => setDeletingAssignment({ id: assignment.id, title: assignment.title })}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Assignment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{assignment.title}</h3>
              <p className="text-sm text-zinc-400 line-clamp-3 mb-4">{assignment.description}</p>
              
              {assignment.questionFileUrl && (
                <div className="mb-4">
                  <a href={assignment.questionFileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors">
                    <Download size={14} />
                    Download Question PDF
                  </a>
                </div>
              )}
              
              {assignment.tags && assignment.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {assignment.tags.map((tag: string) => (
                    <span key={tag} className="text-xs text-zinc-500 bg-black px-2 py-1 rounded">#{tag}</span>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/5">
                <a 
                  href={`/dashboard/admin/assignments/${assignment.id}/submissions`}
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View Submissions
                </a>
              </div>
            </div>
            <div className="p-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5"><Signal size={14} /> {assignment.difficulty}</div>
              <div className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(assignment.deadline).toLocaleDateString()}</div>
              <div className="flex items-center gap-1.5"><Clock size={14} /> {assignment.estimatedTime} hours</div>
            </div>
          </div>
        ))}
        
        {initialAssignments.length === 0 && (
          <div className="col-span-full text-center py-20 border border-white/5 rounded-xl bg-white/[0.01]">
            <FileText size={32} className="mx-auto mb-3 text-zinc-600" />
            <h3 className="text-lg font-medium text-white mb-1">No assignments found</h3>
            <p className="text-zinc-500 text-sm">Create your first assignment for the bootcamp.</p>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-bold">Create New Assignment</h2>
              <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Assignment Title</label>
                <input required name="title" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Build an ERC20 Token" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Module Name / ID</label>
                <input required name="module" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Ethereum Basics" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description (Supports Markdown)</label>
                <textarea required name="description" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[100px]" placeholder="Detailed instructions for the assignment..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Difficulty</label>
                  <select required name="difficulty" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">XP Reward</label>
                  <input required name="xpReward" type="number" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Deadline</label>
                  <input required name="deadline" type="datetime-local" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Estimated Time (Hours)</label>
                  <input required name="estimatedTime" type="number" step="0.5" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="2.5" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tags (comma-separated)</label>
                <input name="tags" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" placeholder="solidity, frontend, react" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Question PDF (Optional)</label>
                <input name="questionFile" type="file" accept=".pdf" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg disabled:opacity-50">
                  {loading ? "Creating..." : "Create Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE ASSIGNMENT MODAL */}
      {deletingAssignment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-red-500/20 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-bold">Delete Assignment</h2>
            </div>
            <div className="p-5">
              <p className="text-zinc-300 text-sm mb-4">
                Are you sure you want to delete <strong className="text-white">"{deletingAssignment.title}"</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeletingAssignment(null)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">Cancel</button>
                <button 
                  onClick={handleDelete} 
                  disabled={loading} 
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ASSIGNMENT MODAL */}
      {editingAssignment && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-lg font-bold">Edit Assignment</h2>
              <button onClick={() => setEditingAssignment(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Assignment Title</label>
                <input required name="title" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={editingAssignment.title} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Module Name / ID</label>
                <input required name="module" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={editingAssignment.module} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description (Supports Markdown)</label>
                <textarea required name="description" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[100px]" defaultValue={editingAssignment.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Difficulty</label>
                  <select required name="difficulty" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={editingAssignment.difficulty}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">XP Reward</label>
                  <input required name="xpReward" type="number" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={editingAssignment.xpReward} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Deadline</label>
                  <input required name="deadline" type="datetime-local" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={new Date(editingAssignment.deadline).toISOString().slice(0, 16)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Estimated Time (Hours)</label>
                  <input required name="estimatedTime" type="number" step="0.5" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={editingAssignment.estimatedTime} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tags (comma-separated)</label>
                <input name="tags" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" defaultValue={editingAssignment.tags?.join(", ")} />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Question PDF (Optional)</label>
                <input name="questionFile" type="file" accept=".pdf" className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingAssignment(null)} className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg disabled:opacity-50">
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple clock icon fallback
function Clock(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
