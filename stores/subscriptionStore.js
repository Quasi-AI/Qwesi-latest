import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';
import { API_ROUTES } from '@/lib/apiRoutes';

export const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      // State
      currentSubscription: null,
      availablePlans: [],
      loading: false,
      error: null,

      // Getters
      getCurrentSubscription: () => get().currentSubscription,
      getAvailablePlans: () => get().availablePlans,
      isLoading: () => get().loading,
      getError: () => get().error,
      isSubscribed: () => get().currentSubscription?.status === "active",
      isPro: () => get().currentSubscription?.status === "active",

      // Actions
      fetchSubscription: async () => {
        set({ loading: true, error: null });

        try {
          // Get token directly from localStorage instead of using hook
          const authData = JSON.parse(localStorage.getItem('auth-store') || '{}');
          const token = authData.state?.token || '';
          
          const response = await fetch(API_ROUTES.USER_DETAILS, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Extract subscription from user details
            const subscription = data.user?.subscription || null;
            set({ currentSubscription: subscription });
            return { success: true, subscription };
          } else {
            const error = data.message || "Failed to fetch subscription";
            set({ error });
            return { success: false, error };
          }
        } catch (error) {
          console.error("Fetch subscription error:", error);
          const errorMsg = "Failed to fetch subscription data";
          set({ error: errorMsg });
          return { success: false, error: errorMsg };
        } finally {
          set({ loading: false });
        }
      },

      fetchPlans: async () => {
        set({ loading: true, error: null });

        try {
          // Get token directly from localStorage
          const authData = JSON.parse(localStorage.getItem('auth-store') || '{}');
          const token = authData.state?.token || '';
          
          const response = await fetch(`${API_ROUTES.BASE_URL}api/subscription/plans`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (response.ok && data.success && data.plans) {
            set({ availablePlans: data.plans });
            return { success: true, plans: data.plans };
          } else {
            const error = data.message || "Failed to fetch plans";
            set({ error });
            return { success: false, error };
          }
        } catch (error) {
          console.error("Fetch plans error:", error);
          const errorMsg = "Failed to fetch subscription plans";
          set({ error: errorMsg });
          return { success: false, error: errorMsg };
        } finally {
          set({ loading: false });
        }
      },

      createCheckoutSession: async (data) => {
        set({ loading: true, error: null });

        try {
          // Get token directly from localStorage
          const authData = JSON.parse(localStorage.getItem('auth-store') || '{}');
          const token = authData.state?.token || '';
          
          console.log('Making API call to:', API_ROUTES.CREATE_CHECKOUT_SESSION);
          console.log('With data:', data);
          console.log('With token:', token ? 'Present' : 'Missing');
          
          const response = await fetch(API_ROUTES.CREATE_CHECKOUT_SESSION, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);

          const result = await response.json();
          console.log('API Response:', result);

          // Handle different response formats from your API
          if (response.ok) {
            // Case 1: API returns {success: true, checkoutUrl: "..."}
            if (result.success && result.checkoutUrl) {
              console.log('Success case 1: success + checkoutUrl');
              return { success: true, checkoutUrl: result.checkoutUrl };
            }
            // Case 2: API returns {checkoutUrl: "..."} (your current format)
            else if (result.checkoutUrl) {
              console.log('Success case 2: checkoutUrl only');
              return { success: true, checkoutUrl: result.checkoutUrl };
            }
            // Case 3: API returns {url: "..."}
            else if (result.url) {
              console.log('Success case 3: url property');
              return { success: true, checkoutUrl: result.url };
            }
            // Case 4: Response is successful but has error message
            else if (result.success === false) {
              console.log('API returned success: false');
              const error = result.error || result.message || "Failed to create checkout session";
              set({ error });
              return { success: false, error };
            }
          }
          
          // If we get here, something went wrong
          console.log('No valid checkout URL found in response');
          const error = result.error || result.message || `HTTP ${response.status}: Failed to create checkout session`;
          set({ error });
          return { success: false, error };
          
        } catch (error) {
          console.error("Create checkout session error:", error);
          const errorMsg = "Network error: Failed to create checkout session";
          set({ error: errorMsg });
          return { success: false, error: errorMsg };
        } finally {
          set({ loading: false });
        }
      },

      createSubscription: async (data) => {
        set({ loading: true, error: null });

        try {
          // Get token directly from localStorage
          const authData = JSON.parse(localStorage.getItem('auth-store') || '{}');
          const token = authData.state?.token || '';
          
          const response = await fetch(`${API_ROUTES.BASE_URL}api/subscription`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok && result.success && result.subscription) {
            set({ currentSubscription: result.subscription });
            return { success: true, subscription: result.subscription };
          } else {
            const error = result.message || "Failed to create subscription";
            set({ error });
            return { success: false, error };
          }
        } catch (error) {
          console.error("Create subscription error:", error);
          const errorMsg = "Failed to create subscription";
          set({ error: errorMsg });
          return { success: false, error: errorMsg };
        } finally {
          set({ loading: false });
        }
      },

      cancelSubscription: async (data) => {
        set({ loading: true, error: null });

        try {
          // Get token directly from localStorage
          const authData = JSON.parse(localStorage.getItem('auth-store') || '{}');
          const token = authData.state?.token || '';
          
          const response = await fetch(API_ROUTES.CANCEL_SUBSCRIPTION, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            // Update local subscription status
            const currentSub = get().currentSubscription;
            if (currentSub) {
              set({
                currentSubscription: {
                  ...currentSub,
                  status: "canceled",
                  cancelAtPeriodEnd: true,
                }
              });
            }
            return { success: true, message: result.message };
          } else {
            const error = result.message || "Failed to cancel subscription";
            set({ error });
            return { success: false, error };
          }
        } catch (error) {
          console.error("Cancel subscription error:", error);
          const errorMsg = "Failed to cancel subscription";
          set({ error: errorMsg });
          return { success: false, error: errorMsg };
        } finally {
          set({ loading: false });
        }
      },

      updatePaymentMethod: async (data) => {
        set({ loading: true, error: null });

        try {
          // Get token directly from localStorage
          const authData = JSON.parse(localStorage.getItem('auth-store') || '{}');
          const token = authData.state?.token || '';
          
          const response = await fetch(API_ROUTES.UPDATE_PAYMENT_METHOD, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            return { success: true, message: result.message };
          } else {
            const error = result.message || "Failed to update payment method";
            set({ error });
            return { success: false, error };
          }
        } catch (error) {
          console.error("Update payment method error:", error);
          const errorMsg = "Failed to update payment method";
          set({ error: errorMsg });
          return { success: false, error: errorMsg };
        } finally {
          set({ loading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set({
          currentSubscription: null,
          availablePlans: [],
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: 'subscription-store',
    }
  )
);