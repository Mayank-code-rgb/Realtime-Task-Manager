import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, or, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export interface Task {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    assigneeEmail: string;
    completed: boolean;
    createdAt: any;
    dueDate?: string;
}

export const useTasks = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const tasksRef = collection(db, 'tasks');

        // Using or() to get tasks where user is owner OR assignee
        const q = query(
            tasksRef,
            or(
                where('ownerId', '==', user.uid),
                where('assigneeEmail', '==', user.email)
            )
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];

            // Sort in memory since Firestore multi-field sort with OR can be complex with indexes
            tasksData.sort((a, b) => {
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeB - timeA; // Descending
            });

            setTasks(tasksData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tasks:", error);
            toast.error("Failed to load tasks.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTask = async (title: string, description: string, dueDate?: string) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'tasks'), {
                title,
                description,
                ownerId: user.uid,
                assigneeEmail: "",
                completed: false,
                createdAt: serverTimestamp(),
                ...(dueDate && { dueDate })
            });
            toast.success("Task created!");
        } catch (e) {
            toast.error("Failed to create task");
            console.error(e);
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            await updateDoc(doc(db, 'tasks', id), updates);
        } catch (e) {
            toast.error("Failed to update task");
            console.error(e);
        }
    };

    const assignTask = async (id: string, email: string) => {
        try {
            // First check if user exists
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email.toLowerCase().trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty && email.trim() !== "") {
                toast.error("User with this email not found in the system.");
                return false;
            }

            await updateDoc(doc(db, 'tasks', id), {
                assigneeEmail: email.toLowerCase().trim()
            });
            toast.success(email ? `Task assigned to ${email}` : "Assignment removed");
            return true;
        } catch (e) {
            toast.error("Failed to assign task");
            console.error(e);
            return false;
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'tasks', id));
            toast.success("Task deleted");
        } catch (e) {
            toast.error("Failed to delete task");
            console.error(e);
        }
    };

    const toggleComplete = async (task: Task) => {
        updateTask(task.id, { completed: !task.completed });
    };

    return { tasks, loading, addTask, updateTask, assignTask, deleteTask, toggleComplete };
};
