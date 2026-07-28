import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ActiveRepairSession } from '../types';
import { repairSessionService } from '../services/repairSessionService';

export function useActiveRepairSession() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<ActiveRepairSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // Check if session is dismissed in local storage (within 12 hours)
  const checkDismissal = useCallback((session: ActiveRepairSession | null) => {
    if (!session) {
      setIsDismissed(false);
      return;
    }
    const key = `dismissed_repair_${session.repairSessionId}`;
    const timestampStr = localStorage.getItem(key);
    if (timestampStr) {
      const dismissedTime = parseInt(timestampStr, 10);
      const TWELVE_HOURS = 12 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < TWELVE_HOURS) {
        setIsDismissed(true);
        return;
      }
    }
    setIsDismissed(false);
  }, []);

  useEffect(() => {
    if (!user) {
      setActiveSession(null);
      setLoading(false);
      setIsDismissed(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time updates from Firestore
    const unsubscribe = repairSessionService.subscribeToActiveSession(
      user.uid,
      (session) => {
        setActiveSession(session);
        checkDismissal(session);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user, checkDismissal]);

  const dismissSession = useCallback(() => {
    if (activeSession) {
      const key = `dismissed_repair_${activeSession.repairSessionId}`;
      localStorage.setItem(key, Date.now().toString());
      setIsDismissed(true);
    }
  }, [activeSession]);

  const cancelSession = useCallback(async () => {
    if (activeSession) {
      await repairSessionService.cancelSession(activeSession.repairSessionId);
      setActiveSession(null);
      setIsDismissed(false);
    }
  }, [activeSession]);

  const refreshActiveSession = useCallback(async () => {
    if (user) {
      const session = await repairSessionService.getActiveSession(user.uid);
      setActiveSession(session);
      checkDismissal(session);
    }
  }, [user, checkDismissal]);

  return {
    activeSession,
    loading,
    isDismissed,
    dismissSession,
    cancelSession,
    refreshActiveSession,
  };
}
