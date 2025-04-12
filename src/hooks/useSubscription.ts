
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscriptionService, SubscriptionPlan } from '@/lib/agent-service';

export function useSubscription() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubscriptionData() {
      if (!user) {
        setCurrentPlan(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [userPlan, plans] = await Promise.all([
          subscriptionService.getCurrentPlan(),
          subscriptionService.getAllPlans()
        ]);
        
        setCurrentPlan(userPlan);
        setAllPlans(plans);
        setError(null);
      } catch (err) {
        console.error('Error loading subscription data:', err);
        setError('Failed to load subscription information');
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptionData();
  }, [user]);

  return {
    currentPlan,
    allPlans,
    loading,
    error,
    isFreePlan: currentPlan?.name === 'Free',
    isPaidPlan: currentPlan?.name !== 'Free',
  };
}
