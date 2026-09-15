import React from 'react';
import { BookOpen, PenSquare, BarChart3, LogOut } from 'lucide-react';

export default function HomeScreen({ onNav, role, user, onLogout }) {
  const items = [
    role.isAdmin && { key: 'admin-list', icon: PenSquare, title: 'Конструктор курсів', desc: 'Створіть новий курс: структура, цілі, наповнення й тести — крок за кроком.' },
    { key: 'catalog', icon: BookOpen, title: 'Проходити курс', desc: 'Відкрийте каталог курсів, читайте і перевіряйте себе тестами у своєму темпі.' },
    (role.isAdmin || role.isHR) && { key: 'hr-select', icon: BarChart3, title: 'HR-панель', desc: 'Перегляньте, хто скільки пройшов і як давав собі оцінку в тестах.' },
  ].filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <div className="flex justify-between items-start mb-12 gap-4">
        <div>
          <p className="text-sm tracking-wide" style={{ color: 'var(--gilt)' }}>Внутрішнє навчання</p>
          <h1 className="cb-serif" style={{ fontSize: '2.4rem', fontWeight: 600, lineHeight: 1.15, marginTop: '.4rem' }}>
            Конструктор навчальних курсів
          </h1>
          <p className="mt-3 max-w-md" style={{ color: 'var(--ink-soft)' }}>
            Готовий текст курсу — у структуровану сторінку, яку можна читати, гортати й проходити тести, бачачи власний прогрес.
          </p>
        </div>
        <button onClick={onLogout} className="text-xs flex items-center gap-1 shrink-0" style={{ color: 'var(--ink-soft)' }} title={user?.email}>
          <LogOut size={14} /> Вийти
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map(it => (
          <button key={it.key} onClick={() => onNav(it.key)} className="cb-card text-left p-5 transition-colors" style={{ borderColor: 'var(--line)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}>
            <it.icon size={22} color="var(--cover)" strokeWidth={1.6} />
            <h2 className="cb-serif font-semibold mt-3 mb-1">{it.title}</h2>
            <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>{it.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
