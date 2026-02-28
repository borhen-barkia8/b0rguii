import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskType = 'Study' | 'Sport' | 'Socialize' | 'Dishes' | 'Reading' | 'Healthy Eating' | 'Hydrate' | 'Wake Up' | 'Coding' | 'Outdoors';

export interface User {
  id: string;
  name: string;
  credits: number;
  streak: number;
  lastLogin: number;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'theme' | 'perk' | 'cosmetic';
}

export interface ActiveChallenge {
  taskType: TaskType;
  betAmount: number;
  expiresAt: number;
  startTime: number;
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  tutorialStep: number;
  leaderboard: { name: string; credits: number; streak: number }[];
  shopItems: ShopItem[];
  purchasedItems: string[];
  activeChallenge: ActiveChallenge | null;
  
  login: (name: string) => void;
  nextTutorial: () => void;
  addCredits: (amount: number) => void;
  removeCredits: (amount: number) => void;
  updateStreak: (streak: number) => void;
  startChallenge: (taskType: TaskType, betAmount: number, durationMinutes: number) => void;
  failChallenge: () => void;
  completeChallenge: () => void;
  buyItem: (itemId: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      tutorialStep: 0,
      purchasedItems: [],
      activeChallenge: null,
      leaderboard: [
        { name: "Unit_X99", credits: 1250, streak: 14 },
        { name: "Efficient_Meat", credits: 840, streak: 8 },
        { name: "Data_Point_42", credits: 620, streak: 5 },
        { name: "Compliance_Bot", credits: 450, streak: 3 },
      ],
      shopItems: [
        { id: 'red-theme', name: 'OVERLOAD_RED', price: 500, description: 'Change UI to emergency red.', type: 'theme' },
        { id: 'streak-freeze', name: 'STREAK_STASIS', price: 200, description: 'Prevent streak loss for 24h.', type: 'perk' },
        { id: 'double-ad', name: 'MARKETING_MAXIMIZER', price: 300, description: 'Ads grant 10 credits instead of 5.', type: 'perk' },
      ],

      login: (name) => {
        const now = Date.now();
        set((state) => {
          const existingUser = state.user;
          let credits = 100;
          let streak = 0;
          
          if (existingUser) {
            credits = existingUser.credits;
            streak = existingUser.streak;
            
            // Daily login bonus
            const lastLoginDate = new Date(existingUser.lastLogin).toDateString();
            const today = new Date(now).toDateString();
            if (lastLoginDate !== today) {
              credits += 10;
            }

            // Inactivity penalty
            const hoursSinceLastLogin = (now - existingUser.lastLogin) / (1000 * 60 * 60);
            if (hoursSinceLastLogin > 48) {
              credits = Math.max(0, credits - 20);
            }
          }

          return {
            user: { id: 'user-1', name: 'b0rguii', credits, streak, lastLogin: now },
            isLoggedIn: true,
          };
        });
      },

      nextTutorial: () => set((state) => ({ tutorialStep: state.tutorialStep + 1 })),
      
      addCredits: (amount) => set((state) => ({
        user: state.user ? { ...state.user, credits: state.user.credits + amount } : null
      })),

      removeCredits: (amount) => set((state) => ({
        user: state.user ? { ...state.user, credits: Math.max(0, state.user.credits - amount) } : null
      })),

      updateStreak: (streak) => set((state) => ({
        user: state.user ? { ...state.user, streak } : null
      })),

      startChallenge: (taskType, betAmount, durationMinutes) => {
        const now = Date.now();
        const expiresAt = now + durationMinutes * 60 * 1000;
        set({ activeChallenge: { taskType, betAmount, expiresAt, startTime: now } });
      },

      failChallenge: () => {
        const state = get() as AppState;
        if (!state.activeChallenge) return;
        
        const bet = state.activeChallenge.betAmount;
        set({ 
          activeChallenge: null,
          user: state.user ? { ...state.user, credits: Math.max(0, state.user.credits - bet), streak: 0 } : null
        });
      },

      completeChallenge: () => {
        const state = get() as AppState;
        if (!state.activeChallenge) return;
        
        const bet = state.activeChallenge.betAmount;
        set({ 
          activeChallenge: null,
          user: state.user ? { ...state.user, credits: state.user.credits + bet, streak: state.user.streak + 1 } : null
        });
      },

      buyItem: (itemId) => set((state) => {
        const item = state.shopItems.find(i => i.id === itemId);
        if (!item || !state.user || state.user.credits < item.price) return state;
        
        return {
          user: { ...state.user, credits: state.user.credits - item.price },
          purchasedItems: [...state.purchasedItems, itemId]
        };
      }),

      logout: () => set({ user: null, isLoggedIn: false, tutorialStep: 0, activeChallenge: null }),
    }),
    {
      name: 'b0rguii-storage',
    }
  )
);
