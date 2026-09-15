import React from 'react';
import { TopBar, ProgressRibbon } from '../ui.jsx';

export default function LearnerCatalog({ courses, progressMap, onOpen, onHome }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <TopBar onHome={onHome} />
      <h1 className="cb-serif text-xl font-semibold mb-5">Каталог курсів</h1>
      {courses.length === 0 && <div className="cb-card p-8 text-center" style={{ color: 'var(--ink-soft)' }}>Курсів поки немає.</div>}
      <div className="space-y-3">
        {courses.map(c => {
          const p = progressMap[c.id];
          const percent = p ? p.percent : 0;
          return (
            <button key={c.id} onClick={() => onOpen(c.id)} className="cb-card w-full text-left p-4 block">
              <h3 className="cb-serif font-semibold">{c.title}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--ink-soft)' }}>{c.description}</p>
              <div className="mt-3"><ProgressRibbon percent={percent} label={percent > 0 ? (percent >= 100 ? 'Пройдено' : 'Ваш прогрес') : 'Ще не розпочато'} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
