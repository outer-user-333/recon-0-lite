import { create } from 'zustand';
import { supabase } from './supabaseClient';

export const useUserStore = create((set) => ({
  session: null,
  user: null,
  profile: null, // <-- ADD a place to store the user's profile data
  loading: true,

  fetchSessionAndProfile: async () => {
    set({ loading: true });
    const { data: { session } } = await supabase.auth.getSession();
    
    let userProfile = null;
    if (session) {
      // If the user is logged in, fetch their profile from our mock API
      try {
        const response = await fetch('http://localhost:3001/api/profile');
        userProfile = await response.json();
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    
    set({ session, user: session?.user, profile: userProfile, loading: false });
  },

  clearAll: () => {
    set({ session: null, user: null, profile: null });
  }
}));

// Fetch session and profile when the app first loads
useUserStore.getState().fetchSessionAndProfile();

// Listen for authentication changes
// eslint-disable-next-line no-unused-vars
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    useUserStore.getState().fetchSessionAndProfile();
  }
  if (event === 'SIGNED_OUT') {
    useUserStore.getState().clearAll();
  }
});