import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    _id: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            loading: true,

            setUser: (user: User | null) => set({ user }),
            setLoading: (loading: boolean) => set({ loading }),

            checkAuth: async () => {
                set({ loading: true });
                try {
                    console.log('Checking auth status...');
                    const response = await fetch('http://localhost:3000/api/auth/check-auth', {
                        credentials: 'include'
                    });
                    console.log('Auth check response:', response);

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Auth check data:', data);
                        set({ user: data.user, loading: false });
                    } else {
                        console.log('Auth check failed');
                        set({ user: null, loading: false });
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    set({ user: null, loading: false });
                }
            }
        }),
        {
            name: 'auth-storage'
        }
    )
);