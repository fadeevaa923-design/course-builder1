import React from 'react';
import { TopBar, ProgressRibbon } from '../ui.jsx';

export default function HRDashboard({ course, records, onBack }) {
  const total = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const rows = records.map(r => {
    const done = (r.completedLessons || []).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const scores = Object.values(r.quizScores || {});
    const correctSum = scores.reduce((s, x) => s + x.correct, 0);
    const totalSum = scores.reduce((s, x) => s + x.total, 0);
    return { ...r, percent, quizPct: totalSum ? Math.round((correctSum / totalSum) * 100) : null };
  }).sort((a, b) => b.percent - a.percent);

  const startedCount = rows.length;
  const finishedCount = rows.filter(r => r.percent >= 100).length;
  const avgPercent = rows.length ? Math.round(rows.reduce((s, r) => s + r.percent, 0) / rows.length) : 0;

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <TopBar onHome={onBack} />
      <h1 className="cb-serif text-xl font-semibold mb-1">{course.title}</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>Звіт бачать лише люди з правами адміністратора або HR.</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="cb-card p-4 text-center"><p className="text-2xl cb-serif font-semibold">{startedCount}</p><p className="text-xs" style={{ color: 'var(--ink-soft)' }}>розпочали</p></div>
        <div className="cb-card p-4 text-center"><p className="text-2xl cb-serif font-semibold">{finishedCount}</p><p className="text-xs" style={{ color: 'var(--ink-soft)' }}>завершили</p></div>
        <div className="cb-card p-4 text-center"><p className="text-2xl cb-serif font-semibold">{avgPercent}%</p><p className="text-xs" style={{ color: 'var(--ink-soft)' }}>середній прогрес</p></div>
      </div>

      {rows.length === 0 ? (
        <div className="cb-card p-8 text-center" style={{ color: 'var(--ink-soft)' }}>Ще ніхто не розпочав цей курс.</div>
      ) : (
        <div className="cb-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dark)' }}>
                <th className="text-left p-3 font-semibold">Співробітник</th>
                <th className="text-left p-3 font-semibold">Відділ</th>
                <th className="text-left p-3 font-semibold">Прогрес</th>
                <th className="text-left p-3 font-semibold">Самоперевірка</th>
                <th className="text-left p-3 font-semibold">Остання активність</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3" style={{ color: 'var(--ink-soft)' }}>{r.department || '—'}</td>
                  <td className="p-3 w-40"><ProgressRibbon percent={r.percent} /></td>
                  <td className="p-3">{r.quizPct != null ? `${r.quizPct}%` : '—'}</td>
                  <td className="p-3" style={{ color: 'var(--ink-soft)' }}>{r.lastVisited ? new Date(r.lastVisited).toLocaleDateString('uk-UA') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
