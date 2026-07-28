import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { ActiveRepairSession } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const repairSessionService = {
  /**
   * Save or update an active repair session in Firestore
   */
  async saveSession(session: ActiveRepairSession): Promise<void> {
    const path = `repair_sessions/${session.repairSessionId}`;
    try {
      const docRef = doc(db, 'repair_sessions', session.repairSessionId);
      await setDoc(docRef, session, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  /**
   * Update partial fields of an active session in Firestore
   */
  async updateSession(
    repairSessionId: string,
    updates: Partial<ActiveRepairSession>
  ): Promise<void> {
    const path = `repair_sessions/${repairSessionId}`;
    try {
      const docRef = doc(db, 'repair_sessions', repairSessionId);
      const updatePayload = {
        ...updates,
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      await updateDoc(docRef, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Cancel an active session in Firestore
   */
  async cancelSession(repairSessionId: string): Promise<void> {
    const path = `repair_sessions/${repairSessionId}`;
    try {
      const docRef = doc(db, 'repair_sessions', repairSessionId);
      await updateDoc(docRef, {
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Mark session as completed in Firestore
   */
  async completeSession(repairSessionId: string): Promise<void> {
    const path = `repair_sessions/${repairSessionId}`;
    try {
      const docRef = doc(db, 'repair_sessions', repairSessionId);
      await updateDoc(docRef, {
        status: 'completed',
        progressPercentage: 100,
        updatedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  /**
   * Fetch the current active session for a given user
   */
  async getActiveSession(userId: string): Promise<ActiveRepairSession | null> {
    const path = 'repair_sessions';
    try {
      const q = query(
        collection(db, 'repair_sessions'),
        where('userId', '==', userId),
        where('status', '==', 'active'),
        orderBy('updatedAt', 'desc'),
        limit(1)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        return querySnap.docs[0].data() as ActiveRepairSession;
      }
      return null;
    } catch (error) {
      // Fallback query if composite index is missing or building
      try {
        const qFallback = query(
          collection(db, 'repair_sessions'),
          where('userId', '==', userId),
          where('status', '==', 'active')
        );
        const querySnap = await getDocs(qFallback);
        if (!querySnap.empty) {
          const sessions = querySnap.docs.map((d) => d.data() as ActiveRepairSession);
          sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          return sessions[0];
        }
        return null;
      } catch (fallbackError) {
        handleFirestoreError(fallbackError, OperationType.LIST, path);
        return null;
      }
    }
  },

  /**
   * Subscribe to real-time updates for user's active session
   */
  subscribeToActiveSession(
    userId: string,
    onSessionChanged: (session: ActiveRepairSession | null) => void
  ): Unsubscribe {
    const path = 'repair_sessions';
    const q = query(
      collection(db, 'repair_sessions'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onSessionChanged(null);
        } else {
          const sessions = snapshot.docs.map((d) => d.data() as ActiveRepairSession);
          sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          onSessionChanged(sessions[0]);
        }
      },
      (error) => {
        console.warn('Real-time session listener network/permission state:', error);
        onSessionChanged(null);
      }
    );
  },
};
