import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface HistoryItem {
  id: string;
  pageName: string;
  conversionType: string;
  timestamp: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: {
    fullName: string;
    profileImage: string | null;
  };
  history: HistoryItem[]; // Stores the recent activity
  setLogin: (status: boolean) => void;
  updateProfileImage: (image: string | null) => void;
  removeProfileImage: () => void;
  addToHistory: (pageName: string, conversionType: string) => void;
  clearHistory: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: {
        fullName: "Alex Morrison",
        profileImage: null,
      },
      history: [],

      setLogin: (status) => set({ isLoggedIn: status }),
      
      updateProfileImage: (image) => 
        set((state) => ({ 
          user: { ...state.user, profileImage: image } 
        })),
        
      removeProfileImage: () => 
        set((state) => ({
          user: { ...state.user, profileImage: null }
        })),

      // Function to add a new history entry
      addToHistory: (pageName, conversionType) => 
        set((state) => {
          // সুন্দর করে ডেট এবং টাইম ফরম্যাট করার জন্য
          const formattedTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });

          return {
            history: [
              {
                id: Math.random().toString(36).substring(2, 11), // substr এর বদলে substring ব্যবহার করা হয়েছে
                pageName,
                conversionType,
                timestamp: formattedTime,
              },
              ...state.history.slice(0, 9) // Keep only the last 10 items
            ]
          };
        }),

      clearHistory: () => set({ history: [] }),

      logout: () => set({ isLoggedIn: false }), 
    }),
    {
      name: 'auth-storage', // saves to localStorage
    }
  )
);