import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, TopBar } from '../ui.jsx';

export default function AdminCourseList({ courses, onCreate, onEdit, onDelete, onHome }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <TopBar onHome={onHome} />
      <div className="flex justify-end mb-4">
        <Button onClick={onCreate}><Plus size={16} /> Новий курс</Button>
      </div>
      {courses.length === 0 && (
        <div className="cb-card p-8 text-center" style={{ color: 'var(--ink-soft)' }}>
          Курсів ще немає. Натисніть «Новий курс», щоб почати.
        </div>
      )}
      <div className="space-y-3">
        {courses.map(c => (
          <div key={c.id} className="cb-card p-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="cb-serif font-semibold">{c.title}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>{c.moduleCount} розділ(ів) · {c.lessonCount} тем</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={() => onEdit(c.id)}>Редагувати</Button>
              <Button variant="ghost" onClick={() => onDelete(c.id)}><Trash2 size={16} /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
