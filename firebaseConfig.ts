import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWubEaD_cnK2jhTKh60MtdfvuQ-kp4Cxo",
  authDomain: "scholasticapp-ed573.firebaseapp.com",
  projectId: "scholasticapp-ed573",
  storageBucket: "scholasticapp-ed573.firebasestorage.app",
  messagingSenderId: "702344107871",
  appId: "1:702344107871:web:f21d70395efe411e3e48ea",
};

const app = initializeApp(firebaseConfig);

// Export auth and app
export const auth = getAuth(app);

export default app;