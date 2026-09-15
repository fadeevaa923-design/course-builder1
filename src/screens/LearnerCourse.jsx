import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ArrowRight, Check, CheckCircle2, Circle, Menu,
} from 'lucide-react';
import { Button, ProgressRibbon, renderContent } from '../ui.jsx';

export default function LearnerCourse({ course, profile, progress, onSave, onExit }) {
  const allLessons = course.modules.flatMap((m, mi) => m.lessons.map((l, li) => ({ m, mi, l, li })));
  const total = allLessons.length;
  const [pos, setPos] = useState(() => {
    if (progress && progress.currentIndex != null) return Math.min(progress.currentIndex, total - 1);
    return 0;
  });
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const completed = new Set((progress && progress.completedLessons) || []);
  const cur = allLessons[pos];
  const percent = total ? Math.round((completed.size / total) * 100) : 0;

  useEffect(() => { setAnswers({}); setChecked({}); }, [pos]);

  async function markAndGo(nextPos) {
    const newCompleted = new Set(completed); newCompleted.add(cur.l.id);
    const quizScores = { ...(progress.quizScores || {}) };
    if (cur.l.quiz.length > 0) {
      const correct = cur.l.quiz.filter(q => answers[q.id] === q.correctIndex).length;
      quizScores[cur.l.id] = { correct, total: cur.l.quiz.length };
    }
    const updated = {
      completedLessons: Array.from(newCompleted),
      quizScores,
      currentIndex: nextPos != null ? nextPos : pos,
      lastVisited: Date.now(),
      name: profile.name,
      department: profile.department || '',
    };
    await onSave(updated);
    if (nextPos != null) setPos(nextPos);
  }

  if (!cur) return null;
  const isLast = pos === total - 1;
  const isDone = completed.has(cur.l.id);

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-72 border-r overflow-y-auto transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dark)' }}>
        <div className="p-4">
          <button onClick={onExit} className="text-xs flex items-center gap-1 mb-4" style={{ color: 'var(--ink-soft)' }}><ChevronLeft size={14} /> До каталогу</button>
          <h2 className="cb-serif font-semibold text-sm mb-2">{course.title}</h2>
          <ProgressRibbon percent={percent} label="Прогрес" />
          <div className="mt-5 space-y-4">
            {course.modules.map((m, mi) => (
              <div key={m.id}>
                <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--gilt)' }}>{mi + 1}. {m.title}</p>
                <div className="space-y-0.5">
                  {m.lessons.map((l) => {
                    const gi = allLessons.findIndex(it => it.l.id === l.id);
                    const done = completed.has(l.id);
                    return (
                      <button key={l.id} onClick={() => { setPos(gi); setSidebarOpen(false); }}
                        className="w-full text-left text-sm flex items-center gap-2 py-1 px-1.5 rounded"
                        style={{ background: gi === pos ? 'var(--card)' : 'transparent' }}>
                        {done ? <CheckCircle2 size={14} color="var(--sage)" /> : <Circle size={14} color="var(--line)" />}
                        <span style={{ color: gi === pos ? 'var(--ink)' : 'var(--ink-soft)' }}>{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex-1 px-5 md:px-10 py-8 max-w-2xl mx-auto w-full">
        <button className="md:hidden mb-4 flex items-center gap-1 text-sm" onClick={() => setSidebarOpen(s => !s)} style={{ color: 'var(--ink-soft)' }}>
          <Menu size={16} /> Зміст курсу
        </button>

        <p className="text-xs mb-1" style={{ color: 'var(--gilt)' }}>{cur.m.title} · тема {pos + 1} з {total}</p>
        <h1 className="cb-serif font-semibold mb-5" style={{ fontSize: '1.6rem' }}>{cur.l.title}</h1>
        <div>{renderContent(cur.l.content) || <p style={{ color: 'var(--ink-soft)' }}>Контент ще не додано.</p>}</div>

        {cur.l.quiz.length > 0 && (
          <div className="mt-8 cb-card p-5">
            <h3 className="cb-serif font-semibold mb-3">Перевірте себе</h3>
            <div className="space-y-5">
              {cur.l.quiz.map((q, qi) => (
                <div key={q.id}>
                  <p className="text-sm font-medium mb-2">{qi + 1}. {q.question}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const picked = answers[q.id] === oi;
                      const isChecked = checked[q.id];
                      let borderColor = 'var(--line)';
                      if (isChecked && picked) borderColor = oi === q.correctIndex ? 'var(--sage)' : 'var(--cover)';
                      if (isChecked && oi === q.correctIndex) borderColor = 'var(--sage)';
                      return (
                        <button key={oi} disabled={isChecked} onClick={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                          className="w-full text-left text-sm px-3 py-2 rounded flex items-center gap-2" style={{ border: `1px solid ${borderColor}`, background: picked ? 'var(--paper-dark)' : 'transparent' }}>
                          <span style={{ width: 16, height: 16, borderRadius: '50%', border: `1px solid ${borderColor}`, display: 'inline-block', flexShrink: 0 }} />
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {!checked[q.id] && answers[q.id] != null && (
                    <Button variant="outline" className="mt-2" onClick={() => setChecked(c => ({ ...c, [q.id]: true }))}>Перевірити</Button>
                  )}
                  {checked[q.id] && (
                    <p className="text-xs mt-2" style={{ color: answers[q.id] === q.correctIndex ? 'var(--sage)' : 'var(--cover)' }}>
                      {answers[q.id] === q.correctIndex ? 'Правильно.' : 'Неправильно.'} {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-5 border-t" style={{ borderColor: 'var(--line)' }}>
          <Button variant="ghost" disabled={pos === 0} onClick={() => markAndGo(pos - 1)}><ChevronLeft size={16} /> Назад</Button>
          {!isLast
            ? <Button onClick={() => markAndGo(pos + 1)}>{isDone ? 'Далі' : 'Позначити пройденим і продовжити'} <ArrowRight size={16} /></Button>
            : <Button onClick={() => markAndGo(pos)}><Check size={16} /> Завершити курс</Button>}
        </div>

        {isLast && isDone && (
          <div className="mt-6 cb-card p-5 text-center">
            <CheckCircle2 size={22} color="var(--sage)" className="mx-auto mb-2" />
            <p className="cb-serif font-semibold">Курс пройдено повністю</p>
            <Button variant="outline" className="mt-3" onClick={onExit}>До каталогу</Button>
          </div>
        )}
      </main>
    </div>
  );
}
