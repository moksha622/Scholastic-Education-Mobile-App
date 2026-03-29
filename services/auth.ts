import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import app from "../firebaseConfig";

const auth = getAuth(app);

// ✅ SIGN UP
export const signup = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// ✅ LOGIN
export const login = (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// ✅ LOGOUT
export const logout = (): Promise<void> => {
  return signOut(auth);
};

// ✅ CURRENT USER
export const getCurrentUser = () => {
  return auth.currentUser;
};