import React, { useState, useEffect } from 'react';
import { CSS } from './ui.jsx';
import { useAuth } from './lib/useAuth.js';
import {
  getCoursesIndex, setCoursesIndex, getCourse, setCourse, deleteCourseDoc,
  getMyProgress, setMyProgress, listProgressForCourse,
} from './lib/db.js';

import Login from './screens/Login.jsx';
import HomeScreen from './screens/Home.jsx';
import AdminCourseList from './screens/AdminCourseList.jsx';
import AdminWizard from './screens/AdminWizard.jsx';
import LearnerCatalog from './screens/LearnerCatalog.jsx';
import LearnerCourse from './screens/LearnerCourse.jsx';
import HRCourseSelect from './screens/HRCourseSelect.jsx';
import HRDashboard from './screens/HRDashboard.jsx';

export default function App() {
  const { user, role, profile, ready, login, logout, saveProfile } = useAuth();

  const [view, setView] = useState('home');
  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeProgress, setActiveProgress] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [editingCourse, setEditingCourse] = useState(null);
  const [hrRecords, setHrRecords] = useState([]);

  // Ім'я/відділ беремо з Google-акаунта; відділ можна додати один раз.
  useEffect(() => {
    if (user && !profile) {
      saveProfile({ name: user.displayName || user.email, department: '' });
    }
  }, [user, profile]);

  const effectiveProfile = profile || (user ? { name: user.displayName || user.email, department: '' } : null);

  async function refreshIndex() {
    const idx = await getCoursesIndex();
    setCourses(idx);
    return idx;
  }

  async function openCatalog() {
    const idx = await refreshIndex();
    const map = {};
    for (const c of idx) {
      const rec = await getMyProgress(c.id, user.uid);
      const total = c.lessonCount || 1;
      map[c.id] = rec ? { percent: Math.round(((rec.completedLessons || []).length / total) * 100) } : { percent: 0 };
    }
    setProgressMap(map);
    setView('catalog');
  }

  async function openCourse(id) {
    const course = await getCourse(id);
    if (!course) return;
    const rec = await getMyProgress(id, user.uid) || { completedLessons: [], quizScores: {}, currentIndex: 0 };
    setActiveCourse(course);
    setActiveCourseId(id);
    setActiveProgress(rec);
    setView('course');
  }

  async function saveProgress(update) {
    const merged = { ...activeProgress, ...update };
    setActiveProgress(merged);
    await setMyProgress(activeCourseId, user.uid, merged);
  }

  function startCreate() { setEditingCourse(null); setView('admin-wizard'); }
  async function startEdit(id) {
    const c = await getCourse(id);
    setEditingCourse(c);
    setView('admin-wizard');
  }
  async function deleteCourse(id) {
    await deleteCourseDoc(id);
    const idx = await getCoursesIndex();
    const next = idx.filter(c => c.id !== id);
    await setCoursesIndex(next);
    setCourses(next);
  }
  async function publishCourse(course) {
    await setCourse(course);
    const idx = await getCoursesIndex();
    const summary = {
      id: course.id, title: course.title, description: course.description,
      moduleCount: course.modules.length,
      lessonCount: course.modules.reduce((s, m) => s + m.lessons.length, 0),
    };
    const next = idx.some(c => c.id === course.id) ? idx.map(c => c.id === course.id ? summary : c) : [...idx, summary];
    await setCoursesIndex(next);
    setCourses(next);
    setView('admin-list');
  }

  async function openHrSelect() { await refreshIndex(); setView('hr-select'); }
  async function openHrDashboard(id) {
    const course = await getCourse(id);
    const records = await listProgressForCourse(id);
    setActiveCourse(course);
    setActiveCourseId(id);
    setHrRecords(records);
    setView('hr-dashboard');
  }

  function nav(k) {
    if (k === 'catalog') return openCatalog();
    if (k === 'hr-select') return openHrSelect();
    if (k === 'admin-list') { refreshIndex(); return setView(k); }
    setView(k);
  }

  if (!ready) return <div className="cb-root"><style>{CSS}</style></div>;

  if (!user) {
    return <div className="cb-root"><style>{CSS}</style><Login onLogin={login} /></div>;
  }

  return (
    <div className="cb-root">
      <style>{CSS}</style>
      {view === 'home' && <HomeScreen onNav={nav} role={role} user={user} onLogout={logout} />}
      {view === 'admin-list' && role.isAdmin && (
        <AdminCourseList courses={courses} onCreate={startCreate} onEdit={startEdit} onDelete={deleteCourse} onHome={() => setView('home')} />
      )}
      {view === 'admin-wizard' && role.isAdmin && (
        <AdminWizard draft={editingCourse} onPublish={publishCourse} onCancel={() => setView('admin-list')} />
      )}
      {view === 'catalog' && (
        <LearnerCatalog courses={courses} progressMap={progressMap} onOpen={openCourse} onHome={() => setView('home')} />
      )}
      {view === 'course' && activeCourse && activeProgress && (
        <LearnerCourse course={activeCourse} profile={effectiveProfile} progress={activeProgress} onSave={saveProgress} onExit={() => setView('catalog')} />
      )}
      {view === 'hr-select' && (role.isAdmin || role.isHR) && (
        <HRCourseSelect courses={courses} onSelect={openHrDashboard} onHome={() => setView('home')} />
      )}
      {view === 'hr-dashboard' && (role.isAdmin || role.isHR) && activeCourse && (
        <HRDashboard course={activeCourse} records={hrRecords} onBack={() => setView('hr-select')} />
      )}
    </div>
  );
}
