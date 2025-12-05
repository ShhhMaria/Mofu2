import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { User } from '../types';

const mapFirebaseUser = (fbUser: any): User => ({
  id: fbUser.uid,
  name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
  email: fbUser.email || '',
  avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.uid}`,
  bio: ''
});

export const AuthService = {
  subscribe: (callback: (user: User | null) => void) => {
    if (!auth) {
      console.warn('Firebase auth not initialized');
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, (u) => {
      callback(u ? mapFirebaseUser(u) : null);
    });
  },

  login: async (email: string, password: string): Promise<User> => {
    if (!auth) throw new Error('Firebase not initialized');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(cred.user);
  },

  signup: async (name: string, email: string, password: string): Promise<User> => {
    if (!auth) throw new Error('Firebase not initialized');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, {
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
    });
    return mapFirebaseUser(cred.user);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    if (!auth) throw new Error('Firebase not initialized');
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not logged in");
    
    try {
      const updates: any = {};
      if (data.name) updates.displayName = data.name;
      if (data.avatar) updates.photoURL = data.avatar;
      
      if (Object.keys(updates).length > 0) {
        await updateProfile(currentUser, updates);
        // Refresh user to get updated profile
        await currentUser.reload();
      }
      return mapFirebaseUser(currentUser);
    } catch (err) {
      console.error('Profile update error:', err);
      throw err;
    }
  },

  logout: async () => {
    if (!auth) return;
    await signOut(auth);
  }
};

