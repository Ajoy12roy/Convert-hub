import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  user: {
    fullName: string;
    profileImage: string | null;
  };
  setLogin: (status: boolean) => void;
  updateProfileImage: (image: string | null) => void;
  removeProfileImage: () => void; // ✅ নতুন: ছবি ডিলিট করার ফাংশন
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false, // শুরুতে লগআউট থাকবে
      user: {
        fullName: "Alex Morrison",
        profileImage: null,
      },
      setLogin: (status) => set({ isLoggedIn: status }),
      
      updateProfileImage: (image) => 
        set((state) => ({ 
          user: { ...state.user, profileImage: image } 
        })),
        
      // ✅ নতুন ফাংশন: এটি কল করলে শুধু ছবি ডিলিট হবে
      removeProfileImage: () => 
        set((state) => ({
          user: { ...state.user, profileImage: null }
        })),

      // ✅ আপডেট: লগআউট করলে এখন আর ডাটা বা ছবি মুছবে না, শুধু লগআউট হবে
      logout: () => set({ isLoggedIn: false }), 
    }),
    {
      name: 'auth-storage',
    }
  )
);