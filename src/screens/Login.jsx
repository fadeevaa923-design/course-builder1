import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '../ui.jsx';

export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="cb-card max-w-sm w-full p-8 text-center">
        <BookOpen size={28} color="var(--cover)" strokeWidth={1.6} className="mx-auto mb-3" />
        <h1 className="cb-serif text-xl font-semibold mb-1">Конструктор навчальних курсів</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--ink-soft)' }}>
          Увійдіть через Google-акаунт, щоб бачити курси й свій прогрес.
        </p>
        <Button className="w-full justify-center" onClick={onLogin}>Увійти через Google</Button>
      </div>
    </div>
  );
}
