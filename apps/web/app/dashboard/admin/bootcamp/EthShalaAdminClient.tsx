"use client";

import { useState } from "react";
import { Plus, Video, Image as ImageIcon, BookOpen, Clock, Tag, Trash2, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { createModule, createLesson, deleteModule, deleteLesson, editModule, editLesson } from "./actions";
import { useRouter } from "next/navigation";

export default function EthShalaAdminClient({ initialModules }: { initialModules: any[] }) {
  const router = useRouter();
  const [isCreatingModule, setIsCreatingModule] = useState(false);
  const [isCreatingLessonFor, setIsCreatingLessonFor] = useState<string | null>(null);
  const [deletingModule, setDeletingModule] = useState<{ id: string; title: string } | null>(null);
  const [deletingLesson, setDeletingLesson] = useState<{ id: string; title: string } | null>(null);
  const [editingModule, setEditingModule] = useState<any | null>(null);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  async function handleCreateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Check if there is an uploaded file
    const file = formData.get("moduleThumbnailFile") as File;
    let finalThumbnailUrl = formData.get("thumbnailUrl") as string || "";

    if (file && file.size > 0) {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          finalThumbnailUrl = url;
        }
      } catch (err) {
        console.error("Failed to upload image", err);
      }
      setUploadingImage(false);
    }

    await createModule({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      xpReward: Number(formData.get("xpReward")),
      duration: formData.get("duration") as string,
      color: formData.get("color") as string,
      thumbnailUrl: finalThumbnailUrl,
      orderIndex: Number(formData.get("orderIndex")),
    });

    setLoading(false);
    setIsCreatingModule(false);
    router.refresh();
  }

  async function handleCreateLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isCreatingLessonFor) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Check if there is an uploaded file
    const file = formData.get("thumbnailFile") as File;
    let finalThumbnailUrl = formData.get("thumbnailUrl") as string;

    if (file && file.size > 0) {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          finalThumbnailUrl = url;
        }
      } catch (err) {
        console.error("Failed to upload image", err);
      }
      setUploadingImage(false);
    }
    
    // Store video URL and thumbnail in a JSON object inside the content field for now
    const contentPayload = JSON.stringify({
      videoUrl: formData.get("videoUrl") as string,
      thumbnailUrl: finalThumbnailUrl,
      text: formData.get("content") as string,
    });
    
    await createLesson(isCreatingLessonFor, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration: formData.get("duration") as string,
      content: contentPayload,
      orderIndex: Number(formData.get("orderIndex")),
    });

    setLoading(false);
    setIsCreatingLessonFor(null);
    router.refresh();
  }

  async function handleDeleteModule() {
    if (!deletingModule) return;
    setLoading(true);
    await deleteModule(deletingModule.id);
    setLoading(false);
    setDeletingModule(null);
    router.refresh();
  }

  async function handleDeleteLesson() {
    if (!deletingLesson) return;
    setLoading(true);
    await deleteLesson(deletingLesson.id);
    setLoading(false);
    setDeletingLesson(null);
    router.refresh();
  }

  async function handleEditModuleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingModule) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get("moduleThumbnailFile") as File;
    let finalThumbnailUrl = formData.get("thumbnailUrl") as string || "";

    if (file && file.size > 0) {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      try {
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          finalThumbnailUrl = url;
        }
      } catch (err) {}
      setUploadingImage(false);
    }

    await editModule(editingModule.id, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      xpReward: Number(formData.get("xpReward")),
      duration: formData.get("duration") as string,
      color: formData.get("color") as string,
      thumbnailUrl: finalThumbnailUrl,
      orderIndex: Number(formData.get("orderIndex")),
    });

    setLoading(false);
    setEditingModule(null);
    router.refresh();
  }

  async function handleEditLessonSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingLesson) return;
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("thumbnailFile") as File;
    let finalThumbnailUrl = formData.get("thumbnailUrl") as string;

    if (file && file.size > 0) {
      setUploadingImage(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      try {
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          finalThumbnailUrl = url;
        }
      } catch (err) {}
      setUploadingImage(false);
    }
    
    const contentPayload = JSON.stringify({
      videoUrl: formData.get("videoUrl") as string,
      thumbnailUrl: finalThumbnailUrl,
      text: formData.get("content") as string,
    });
    
    await editLesson(editingLesson.id, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration: formData.get("duration") as string,
      content: contentPayload,
      orderIndex: Number(formData.get("orderIndex")),
    });

    setLoading(false);
    setEditingLesson(null);
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsCreatingModule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-semibold rounded-lg transition-colors"
        >
          <Plus size={18} />
          Create Module
        </button>
      </div>

      <div className="space-y-6">
        {initialModules.map((module) => (
          <div key={module.id} className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div 
              className="p-5 border-b border-border flex items-center justify-between cursor-pointer group hover:bg-accent transition-colors"
              onClick={() => toggleModule(module.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-3 h-3 rounded-full ${module.color}`} />
                  <h2 className="text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">{module.title}</h2>
                </div>
                <p className="text-muted-foreground text-sm">{module.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {module.duration}</span>
                <span className="flex items-center gap-1.5"><Tag size={14} /> {module.xpReward} XP</span>
                
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setEditingModule(module); }}
                    className="p-2 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                    title="Edit Module"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setDeletingModule({ id: module.id, title: module.title }); }}
                    className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete Module"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="p-1 text-muted-foreground bg-accent rounded-full">
                    {expandedModules[module.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
              </div>
            </div>

            {expandedModules[module.id] && (
              <div className="p-5 bg-white/[0.01]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Lessons</h3>
                  <button
                    onClick={() => setIsCreatingLessonFor(module.id)}
                    className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={14} /> Add Lesson
                  </button>
                </div>

                {module.mappedLessons && module.mappedLessons.length > 0 ? (
                  <div className="grid gap-3">
                    {module.mappedLessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-white/[0.04] hover:bg-accent hover:border-emerald-500/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-emerald-500/50" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-muted-foreground font-mono bg-background px-2 py-1 rounded">
                            {lesson.duration}
                          </span>
                          <button
                            onClick={() => setEditingLesson(lesson)}
                            className="text-muted-foreground hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                            title="Edit Lesson"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => setDeletingLesson({ id: lesson.id, title: lesson.title })}
                            className="text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                            title="Delete Lesson"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground text-sm mb-2">No lessons added yet.</p>
                    <button
                      onClick={() => setIsCreatingLessonFor(module.id)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      Click here to add the first lesson
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {initialModules.length === 0 && (
          <div className="text-center py-20 border border-border rounded-xl bg-white/[0.01]">
            <BookOpen size={32} className="mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-1">No modules found</h3>
            <p className="text-muted-foreground text-sm">Create your first EthShala module to get started.</p>
          </div>
        )}
      </div>

      {/* CREATE MODULE MODAL */}
      {isCreatingModule && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Create New Module</h2>
              <button onClick={() => setIsCreatingModule(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleCreateModule} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Module Title</label>
                <input required name="title" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="e.g. Ethereum Basics" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea required name="description" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 min-h-[80px]" placeholder="Brief overview of what students will learn..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">XP Reward</label>
                  <input required name="xpReward" type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="1000" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Duration</label>
                  <input required name="duration" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="2 Weeks" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Theme Color (Tailwind class)</label>
                  <input required name="color" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="bg-blue-500" defaultValue="bg-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order Index</label>
                  <input required name="orderIndex" type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue="1" />
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                  <ImageIcon size={14} /> Module Thumbnail (URL or Upload)
                </label>
                <input name="thumbnailUrl" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 mb-2" placeholder="https://..." />
                <input type="file" name="moduleThumbnailFile" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreatingModule(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={loading || uploadingImage} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {uploadingImage ? "Uploading..." : loading ? "Creating..." : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE LESSON MODAL */}
      {isCreatingLessonFor && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Add Lesson to Module</h2>
              <button onClick={() => setIsCreatingLessonFor(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleCreateLesson} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Lesson Title</label>
                <input required name="title" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="e.g. Introduction to Smart Contracts" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Short Description</label>
                <textarea required name="description" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 min-h-[60px]" placeholder="What will students learn in this lesson?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Duration</label>
                  <input required name="duration" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="e.g. 15 mins" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order Index</label>
                  <input required name="orderIndex" type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue="1" />
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Media & Content</h4>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <Video size={14} /> Video URL (YouTube/Vimeo)
                  </label>
                  <input name="videoUrl" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <ImageIcon size={14} /> Thumbnail Image URL (Or Upload Below)
                  </label>
                  <input name="thumbnailUrl" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 mb-2" placeholder="https://..." />
                  <input type="file" name="thumbnailFile" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Markdown Content</label>
                  <textarea name="content" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 min-h-[120px] font-mono" placeholder="Write additional text instructions in markdown..." />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreatingLessonFor(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={loading || uploadingImage} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {uploadingImage ? "Uploading..." : loading ? "Saving..." : "Save Lesson"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODULE MODAL */}
      {deletingModule && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-red-500/20 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-bold">Delete Module</h2>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground text-sm mb-4">
                Are you sure you want to delete <strong className="text-foreground">"{deletingModule.title}"</strong>? 
                This action cannot be undone and will delete all associated lessons.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeletingModule(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button 
                  onClick={handleDeleteModule} 
                  disabled={loading} 
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-foreground text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE LESSON MODAL */}
      {deletingLesson && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-red-500/20 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-bold">Delete Lesson</h2>
            </div>
            <div className="p-5">
              <p className="text-muted-foreground text-sm mb-4">
                Are you sure you want to delete <strong className="text-foreground">"{deletingLesson.title}"</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeletingLesson(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button 
                  onClick={handleDeleteLesson} 
                  disabled={loading} 
                  className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-foreground text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODULE MODAL */}
      {editingModule && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Edit Module</h2>
              <button onClick={() => setEditingModule(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleEditModuleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Module Title</label>
                <input required name="title" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingModule.title} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea required name="description" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 min-h-[80px]" defaultValue={editingModule.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">XP Reward</label>
                  <input required name="xpReward" type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingModule.xpReward} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Duration</label>
                  <input required name="duration" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingModule.duration} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Theme Color (Tailwind class)</label>
                  <input required name="color" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingModule.color} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order Index</label>
                  <input required name="orderIndex" type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingModule.orderIndex || editingModule.section} />
                </div>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                  <ImageIcon size={14} /> Module Thumbnail (URL or Upload)
                </label>
                <input name="thumbnailUrl" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 mb-2" defaultValue={editingModule.thumbnailUrl} />
                <input type="file" name="moduleThumbnailFile" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingModule(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={loading || uploadingImage} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {uploadingImage ? "Uploading..." : loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LESSON MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-bold">Edit Lesson</h2>
              <button onClick={() => setEditingLesson(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <form onSubmit={handleEditLessonSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Lesson Title</label>
                <input required name="title" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingLesson.title} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Short Description</label>
                <textarea required name="description" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 min-h-[60px]" defaultValue={editingLesson.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Duration</label>
                  <input required name="duration" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingLesson.duration} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order Index</label>
                  <input required name="orderIndex" type="number" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" defaultValue={editingLesson.orderIndex} />
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-lg space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Media & Content</h4>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <Video size={14} /> Video URL (YouTube/Vimeo)
                  </label>
                  <input name="videoUrl" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500" 
                    defaultValue={(() => {
                      try { return JSON.parse(editingLesson.content).videoUrl || ""; } catch(e) { return ""; }
                    })()}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5">
                    <ImageIcon size={14} /> Thumbnail Image URL (Or Upload Below)
                  </label>
                  <input name="thumbnailUrl" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 mb-2" 
                    defaultValue={(() => {
                      try { return JSON.parse(editingLesson.content).thumbnailUrl || ""; } catch(e) { return ""; }
                    })()}
                  />
                  <input type="file" name="thumbnailFile" accept="image/*" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Markdown Content</label>
                  <textarea name="content" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-emerald-500 min-h-[120px] font-mono" 
                    defaultValue={(() => {
                      try { return JSON.parse(editingLesson.content).text || editingLesson.content; } catch(e) { return editingLesson.content; }
                    })()}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingLesson(null)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" disabled={loading || uploadingImage} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black text-sm font-bold rounded-lg disabled:opacity-50 flex items-center gap-2">
                  {uploadingImage ? "Uploading..." : loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
