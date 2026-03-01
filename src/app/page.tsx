"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskModal } from "@/components/CreateTaskModal";
import { LogOut, Plus, Search, CheckSquare, ListTodo, Inbox, Camera } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, loading: authLoading, logout, updateProfilePhoto } = useAuth();
  const { tasks, loading: tasksLoading, addTask, updateTask, assignTask, deleteTask, toggleComplete } = useTasks();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "assigned_to_me">("all");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      await updateProfilePhoto(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50" />
      </div>
    );
  }

  const handleCreateTask = async (title: string, description: string, dueDate?: string) => {
    await addTask(title, description, dueDate);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "assigned_to_me") {
      return matchesSearch && task.assigneeEmail === user.email;
    }
    return matchesSearch;
  });

  const incompleteTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  // Determine greeting based on time
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  return (
    <div className="relative min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-200/40 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -top-10 left-1/2 w-80 h-80 bg-pink-200/40 dark:bg-pink-900/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
              <CheckSquare size={16} strokeWidth={3} />
            </div>
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex flex-col text-right">
                <span className="text-sm font-medium">{user.displayName || "User"}</span>
                <span className="text-xs text-zinc-500">{user.email}</span>
              </div>

              <div className="relative group cursor-pointer">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="h-9 w-9 rounded-full ring-2 ring-zinc-200 dark:ring-zinc-800 object-cover" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 uppercase text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 font-medium">
                    {user.email?.[0] || "U"}
                  </div>
                )}

                {/* Upload Overlay */}
                <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer overflow-hidden">
                  {isUploadingPhoto ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <Camera size={14} className="text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={isUploadingPhoto}
                  />
                </label>
              </div>
            </div>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>

            <button
              onClick={logout}
              className="flex items-center justify-center rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent pb-1">
              {greeting}, {user.displayName?.split(' ')[0] || "User"}
            </h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <span>You have <strong className="text-zinc-900 dark:text-zinc-50">{incompleteTasks.length}</strong> pending tasks</span>
              {completedTasks.length > 0 && (
                <>
                  <span className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                  <span><strong className="text-emerald-600 dark:text-emerald-400">{completedTasks.length}</strong> completed</span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-zinc-50/10 dark:hover:bg-zinc-200 block"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            Create Task
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900/80 ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "all"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
            >
              <ListTodo size={16} />
              All Tasks
            </button>
            <button
              onClick={() => setActiveTab("assigned_to_me")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "assigned_to_me"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
            >
              <Inbox size={16} />
              Assigned to Me
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-50 dark:focus:ring-zinc-50 transition-all placeholder:text-zinc-400"
            />
          </div>
        </motion.div>

        {tasksLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 ring-1 ring-zinc-200 dark:ring-zinc-800"></div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
              <Inbox size={28} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">No tasks found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              {searchQuery
                ? "Try adjusting your search terms to find what you're looking for."
                : "You don't have any tasks right now. Create one to get started!"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 font-medium text-zinc-900 underline hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
              >
                Create new task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {incompleteTasks.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  To Do — {incompleteTasks.length}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {incompleteTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleComplete}
                        onDelete={deleteTask}
                        onAssign={assignTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {completedTasks.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Completed — {completedTasks.length}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={toggleComplete}
                        onDelete={deleteTask}
                        onAssign={assignTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
