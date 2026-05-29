import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

interface HistoryItem {
  id: string;
  pageName: string;
  conversionType: string;
  timestamp: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  profileImage: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  savedProfiles: Record<string, UserProfile>;
  history: HistoryItem[];

  // Actions
  loginUser: (email: string, fullName: string) => void;
  logout: () => void;
  updateProfileImage: (image: string | null) => void;
  removeProfileImage: () => void;
  updateProfileName: (name: string) => void;
  addToHistory: (pageName: string, conversionType: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

// 🚀 ১. বড় সাইজের ছবি সেভ রাখার জন্য কাস্টম IndexedDB স্টোরেজ ইঞ্জিন (Quota Limits ফিক্স)
const IndexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('ConvertHubDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('keyval');
      };
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('keyval')) {
          resolve(null);
          return;
        }
        const tx = db.transaction('keyval', 'readonly');
        const store = tx.objectStore('keyval');
        const getReq = store.get(name);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('ConvertHubDB', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('keyval');
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction('keyval', 'readwrite');
        const store = tx.objectStore('keyval');
        store.put(value, name);
        tx.oncomplete = () => resolve();
      };
      request.onerror = () => resolve();
    });
  },
  removeItem: async (name: string): Promise<void> => {
    return new Promise((resolve) => {
      const request = indexedDB.open('ConvertHubDB', 1);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('keyval')) {
          resolve();
          return;
        }
        const tx = db.transaction('keyval', 'readwrite');
        const store = tx.objectStore('keyval');
        store.delete(name);
        tx.oncomplete = () => resolve();
      };
      request.onerror = () => resolve();
    });
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      savedProfiles: {},
      history: [],

      // স্মার্ট লগইন
      loginUser: (email, fullName) => {
        const { savedProfiles } = get();
        const existingProfile = savedProfiles[email];

        if (existingProfile) {
          set({ isLoggedIn: true, user: existingProfile });
        } else {
          const newUser = { email, fullName, profileImage: null };
          set({
            isLoggedIn: true,
            user: newUser,
            savedProfiles: { ...savedProfiles, [email]: newUser }
          });
        }
      },

      logout: () => set({ isLoggedIn: false, user: null }),

      updateProfileImage: (image) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, profileImage: image };
          return {
            user: updatedUser,
            savedProfiles: { ...state.savedProfiles, [state.user.email]: updatedUser }
          };
        }),

      removeProfileImage: () =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, profileImage: null };
          return {
            user: updatedUser,
            savedProfiles: { ...state.savedProfiles, [state.user.email]: updatedUser }
          };
        }),

      updateProfileName: (name) =>
        set((state) => {
          if (!state.user) return state;
          const updatedUser = { ...state.user, fullName: name };
          return {
            user: updatedUser,
            savedProfiles: { ...state.savedProfiles, [state.user.email]: updatedUser }
          };
        }),

      // History Actions
      addToHistory: (pageName, conversionType) =>
        set((state) => ({
          history: [
            {
              id: Math.random().toString(36).substring(2, 11),
              pageName,
              conversionType,
              timestamp: new Date().toLocaleString(),
            },
            ...state.history.slice(0, 9)
          ]
        })),

      removeFromHistory: (id: string) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id)
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'auth-storage',
      // ✅ এখানে localStorage এর বদলে IndexedDB কানেক্ট করে দেওয়া হলো
      storage: createJSONStorage(() => IndexedDBStorage), 
    }
  )
);