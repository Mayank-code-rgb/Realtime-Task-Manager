"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { auth, googleProvider, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfilePhoto: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    logout: async () => { },
    updateProfilePhoto: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            // If user logs in, ensure they are in the user database
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: currentUser.uid,
                        name: currentUser.displayName,
                        email: currentUser.email,
                        avatar: currentUser.photoURL,
                        createdAt: serverTimestamp(),
                    });
                }
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const updateProfilePhoto = async (file: File) => {
        if (!user) return;

        try {
            // 1. Upload to Firebase Storage
            const fileRef = ref(storage, `avatars/${user.uid}/${file.name}`);
            await uploadBytes(fileRef, file);

            // 2. Get the download URL
            const photoURL = await getDownloadURL(fileRef);

            // 3. Update Firebase Auth Profile
            await updateProfile(user, { photoURL });

            // 4. Update Firestore User Document
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { avatar: photoURL });

            // 5. Update local state to force re-render
            setUser({ ...user, photoURL } as User);

            toast.success("Profile photo updated successfully!");
        } catch (error: any) {
            console.error("Error updating profile photo:", error);

            // Extract specific Firebase error message if available
            const errorMessage = error.message || error.code || "Failed to update profile photo.";
            toast.error(`Error: ${errorMessage}`);

            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout, updateProfilePhoto }}>
            {children}
        </AuthContext.Provider>
    );
};
