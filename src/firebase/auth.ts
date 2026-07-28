import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';
import { UserProfile } from '../types';

export async function syncUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const fallbackProfile: UserProfile = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Member',
    photoURL: user.photoURL || null,
    createdAt: new Date().toISOString(),
    totalSavedDollars: 0,
    totalSavedNaira: 0,
    totalTechFeesAvoidedNaira: 0,
    completedRepairsCount: 0,
    diyLevel: 'intermediate',
  };

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        await setDoc(userRef, fallbackProfile);
      } catch (err) {
        console.warn('Could not save user profile to Firestore (offline or pending):', err);
      }
      return fallbackProfile;
    } else {
      return { ...fallbackProfile, ...userSnap.data() } as UserProfile;
    }
  } catch (err) {
    console.warn('Unable to sync user profile with Firestore (offline mode), using fallback:', err);
    return fallbackProfile;
  }
}

export async function loginWithEmail(email: string, pass: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(userCredential.user);
  return userCredential.user;
}

export async function registerWithEmail(email: string, pass: string, displayName?: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && userCredential.user) {
    await firebaseUpdateProfile(userCredential.user, { displayName });
  }
  await syncUserProfile(userCredential.user);
  return userCredential.user;
}

export async function loginWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(userCredential.user);
  return userCredential.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  await firebaseSignOut(auth);
}

export async function updateUserProfileData(uid: string, updates: Partial<UserProfile>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
}
