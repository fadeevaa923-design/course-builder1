import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';
import { getMyRole, getMyProfile, setMyProfile } from './db.js';

export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = ще завантажується, null = не увійшов
  const [role, setRole] = useState({ isAdmin: false, isHR: false });
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const [r, p] = await Promise.all([getMyRole(u.uid), getMyProfile(u.uid)]);
        setRole(r);
        setProfile(p);
      } else {
        setRole({ isAdmin: false, isHR: false });
        setProfile(null);
      }
      setReady(true);
    });
    return unsub;
  }, []);

  async function login() {
    await signInWithPopup(auth, googleProvider);
  }
  async function logout() {
    await signOut(auth);
  }
  async function saveProfile(patch) {
    if (!user) return;
    const next = { ...(profile || {}), ...patch };
    await setMyProfile(user.uid, next);
    setProfile(next);
  }

  return { user, role, profile, ready, login, logout, saveProfile };
}
