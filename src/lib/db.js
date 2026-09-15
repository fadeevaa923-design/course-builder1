import {
  doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase.js';

/* ---------- roles ---------- */
// Ролі не редагуються з інтерфейсу навмисно — тільки власник проєкту
// додає/змінює документи в колекції `roles` через Firebase Console.
export async function getMyRole(uid) {
  if (!uid) return { isAdmin: false, isHR: false };
  const snap = await getDoc(doc(db, 'roles', uid));
  if (!snap.exists()) return { isAdmin: false, isHR: false };
  const d = snap.data();
  return { isAdmin: !!d.isAdmin, isHR: !!d.isHR };
}

/* ---------- user profile (per-user, private) ---------- */
export async function getMyProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}
export async function setMyProfile(uid, profile) {
  await setDoc(doc(db, 'users', uid), profile, { merge: true });
}

/* ---------- courses ---------- */
export async function getCoursesIndex() {
  const snap = await getDoc(doc(db, 'courseIndex', 'list'));
  return snap.exists() ? (snap.data().items || []) : [];
}
export async function setCoursesIndex(items) {
  await setDoc(doc(db, 'courseIndex', 'list'), { items });
}
export async function getCourse(id) {
  const snap = await getDoc(doc(db, 'courses', id));
  return snap.exists() ? snap.data() : null;
}
export async function setCourse(course) {
  await setDoc(doc(db, 'courses', course.id), course);
}
export async function deleteCourseDoc(id) {
  await deleteDoc(doc(db, 'courses', id));
}

/* ---------- progress ---------- */
// id прогресу = courseId_uid, щоб кожен міг писати лише свій документ
export async function getMyProgress(courseId, uid) {
  const snap = await getDoc(doc(db, 'progress', `${courseId}_${uid}`));
  return snap.exists() ? snap.data() : null;
}
export async function setMyProgress(courseId, uid, data) {
  await setDoc(doc(db, 'progress', `${courseId}_${uid}`), {
    ...data, uid, courseId,
  }, { merge: true });
}
// Тільки для admin/HR — правила Firestore перевіряють це на сервері
export async function listProgressForCourse(courseId) {
  const q = query(collection(db, 'progress'), where('courseId', '==', courseId));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}
