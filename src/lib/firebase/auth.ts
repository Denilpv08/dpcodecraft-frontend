import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config";

const googleProvider = new GoogleAuthProvider();

// Login con email y contraseña
export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Registro con email y contraseña
export const registerWithEmail = async (
  email: string,
  password: string,
): Promise<FirebaseUser> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
};

// Login con Google
export const loginWithGoogle = async (): Promise<FirebaseUser> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// Recuperar contraseña
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Obtener token actual para enviar al backend
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

// Observer de estado de autenticación
export const onAuthChange = (
  callback: (user: FirebaseUser | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
