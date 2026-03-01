import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/hooks/useTasks';
import { useAuth } from '@/context/AuthContext';
import { Clock, User, CheckCircle2, Circle, MoreVertical, Trash2, Send } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onToggle: (task: Task) => void;
    onDelete: (id: string) => void;
    onAssign: (id: string, email: string) => Promise<boolean>;
}

export function TaskCard({ task, onToggle, onDelete, onAssign }: TaskCardProps) {
    const { user } = useAuth();
    const [showOptions, setShowOptions] = useState(false);
    const [assignEmail, setAssignEmail] = useState(task.assigneeEmail || '');
    const [isAssigning, setIsAssigning] = useState(false);

    const isOwner = user?.uid === task.ownerId;
    const isAssignedToMe = task.assigneeEmail === user?.email;

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (assignEmail === task.assigneeEmail) return;

        setIsAssigning(true);
        const success = await onAssign(task.id, assignEmail);
        if (success) {
            setShowOptions(false);
        }
        setIsAssigning(false);
    };

    const formattedDate = task.createdAt
        ? new Date(task.createdAt.toDate ? task.createdAt.toDate() : task.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        })
        : 'Just now';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            whileHover={{ scale: 1.015, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`group relative flex flex-col gap-3 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 backdrop-blur-sm transition-all hover:shadow-xl dark:bg-zinc-900/80 ${task.completed
                ? 'ring-zinc-100 dark:ring-zinc-800/40 opacity-50 hover:opacity-100'
                : 'ring-zinc-200/50 hover:ring-zinc-300 dark:ring-zinc-800 dark:hover:ring-zinc-700'
                }`}
        >
            <div className="flex items-start justify-between gap-4">
                <button
                    onClick={() => onToggle(task)}
                    className="mt-0.5 flex-shrink-0 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                >
                    {task.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    ) : (
                        <Circle className="h-6 w-6" />
                    )}
                </button>

                <div className="flex-1">
                    <h3 className={`text-base font-semibold transition-all ${task.completed ? 'text-zinc-400 line-through dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-50'
                        }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className={`mt-1 text-sm ${task.completed ? 'text-zinc-400 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'
                            }`}>
                            {task.description}
                        </p>
                    )}
                </div>

                {isOwner && (
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </button>
                        <AnimatePresence>
                            {showOptions && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full z-10 mt-2 w-64 rounded-xl bg-white p-2 shadow-xl ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700"
                                >
                                    <form onSubmit={handleAssign} className="mb-2 flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="Assign email..."
                                            value={assignEmail}
                                            onChange={(e) => setAssignEmail(e.target.value)}
                                            className="w-full rounded-lg border border-zinc-200 bg-transparent px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:focus:ring-zinc-50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isAssigning}
                                            className="flex items-center justify-center rounded-lg bg-zinc-900 px-3 text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </form>
                                    <button
                                        onClick={() => onDelete(task.id)}
                                        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete Task
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <div className="mt-2 flex items-center gap-4 pl-10">
                <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formattedDate}
                </div>

                {task.assigneeEmail && (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${isAssignedToMe ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'
                        }`}>
                        <User className="h-3.5 w-3.5" />
                        {isAssignedToMe ? 'Assigned to you' : task.assigneeEmail}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
