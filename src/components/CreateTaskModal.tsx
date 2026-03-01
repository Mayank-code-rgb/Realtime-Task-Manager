import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (title: string, description: string, dueDate?: string) => Promise<void>;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);
        await onSubmit(title.trim(), description.trim(), dueDate);
        setIsSubmitting(false);

        setTitle('');
        setDescription('');
        setDueDate('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-zinc-900/40 backdrop-blur-sm dark:bg-black/60"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 xl:p-0 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md pointer-events-auto overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
                        >
                            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800/60">
                                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">New Task</h2>
                                <button
                                    onClick={onClose}
                                    className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 pb-8">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Task Title
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            autoFocus
                                            required
                                            placeholder="What needs to be done?"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Description <span className="text-zinc-400 font-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={3}
                                            placeholder="Add more details..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full resize-none rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="dueDate" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Due Date <span className="text-zinc-400 font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            id="dueDate"
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50 dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !title.trim()}
                                        className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-offset-zinc-900 transition-all"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-white dark:border-zinc-500 dark:border-t-zinc-900" />
                                        ) : (
                                            <Plus className="h-4 w-4" />
                                        )}
                                        Create Task
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
