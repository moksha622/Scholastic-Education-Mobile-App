import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import app from "../firebaseConfig";

// 🔥 INIT FIRESTORE
export const db = getFirestore(app);

// ✅ CREATE USER DATA (UPDATED)
export const createUserData = async (userId: string, email: string) => {
  if (!userId) return;

  await setDoc(doc(db, "users", userId), {
    uid: userId,
    email: email, // ✅ STORE EMAIL
    xp: 0,
    hearts: 5,
    streak: 0,
    dailyPoints: 0,
    createdAt: new Date(),
  });
};

// ✅ GET USER DATA
export const getUserData = async (userId: string) => {
  if (!userId) return null;

  const docRef = doc(db, "users", userId);
  const snap = await getDoc(docRef);

  return snap.exists() ? snap.data() : null;
};

// ✅ UPDATE USER DATA
export const updateUserData = async (userId: string, data: any) => {
  if (!userId) return;

  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, data);
};