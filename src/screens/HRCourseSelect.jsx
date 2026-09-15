import React from 'react';
import { BarChart3 } from 'lucide-react';
import { TopBar } from '../ui.jsx';

export default function HRCourseSelect({ courses, onSelect, onHome }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <TopBar onHome={onHome} />
      <h1 className="cb-serif text-xl font-semibold mb-5">Оберіть курс для звіту</h1>
      <div className="space-y-2">
        {courses.map(c => (
          <button key={c.id} onClick={() => onSelect(c.id)} className="cb-card w-full text-left p-4 flex items-center justify-between">
            <span className="cb-serif font-semibold">{c.title}</span>
            <BarChart3 size={16} color="var(--gilt)" />
          </button>
        ))}
        {courses.length === 0 && <p style={{ color: 'var(--ink-soft)' }}>Опублікованих курсів немає.</p>}
      </div>
    </div>
  );
}
