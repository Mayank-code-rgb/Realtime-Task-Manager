"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { LogIn, Activity } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            toast.success("Successfully logged in!");
        } catch (error) {
            toast.error("Failed to log in with Google.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50" />
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center items-center">
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob"></div>
                <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-200/40 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200/40 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="z-10 w-full max-w-md overflow-hidden rounded-3xl bg-white/70 shadow-2xl ring-1 ring-zinc-200 backdrop-blur-xl dark:bg-zinc-900/70 dark:ring-zinc-800"
            >
                <div className="flex flex-col items-center p-10 text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                        <Activity size={32} strokeWidth={2.5} />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Welcome Back
                    </h1>
                    <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
                        Sign in to manage your tasks and collaborate with your team in real-time.
                    </p>

                    <button
                        onClick={handleLogin}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-medium text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        <LogIn size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        Continue with Google
                    </button>
                </div>
                <div className="bg-zinc-100/50 px-10 py-5 text-center dark:bg-zinc-950/50 flex flex-col justify-center items-center backdrop-blur-sm border-t border-zinc-200/50 dark:border-zinc-800/50">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
