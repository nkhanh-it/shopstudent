
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Address } from '../types';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  saveAddress: (address: Address) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let userData: User | null = null;
        if (db) {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            userData = userDoc.data() as User;
          }
        }

        if (!userData) {
          const isAdminEmail = firebaseUser.email === 'admin@shop.com';
          userData = {
            id: firebaseUser.uid as any,
            name: firebaseUser.displayName || 'Người dùng',
            email: firebaseUser.email || '',
            role: isAdminEmail ? UserRole.ADMIN : UserRole.USER,
            avatar: firebaseUser.photoURL || `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
            savedAddresses: []
          };
        }
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!auth) throw new Error("Firebase Auth chưa được khởi tạo");
    await signInWithEmailAndPassword(auth, email, password || '');
  };

  const register = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error("Firebase Auth chưa được khởi tạo");
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(firebaseUser, { displayName: name });

    const newUser: User = {
      id: firebaseUser.uid as any,
      name,
      email,
      role: email === 'admin@shop.com' ? UserRole.ADMIN : UserRole.USER,
      avatar: `https://i.pravatar.cc/150?u=${firebaseUser.uid}`,
      savedAddresses: []
    };

    if (db) {
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);
    }
    setUser(newUser);
  };

  const saveAddress = async (address: Address) => {
    if (!user || !db) return;
    const userRef = doc(db, "users", user.id.toString());
    await updateDoc(userRef, {
      savedAddresses: arrayUnion(address)
    });
    setUser(prev => prev ? {
      ...prev,
      savedAddresses: [...(prev.savedAddresses || []), address]
    } : null);
  };

  const logout = async () => {
    if (auth) await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout,
      saveAddress,
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.ADMIN,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};
