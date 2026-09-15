import React from 'react';
import { ChevronLeft } from 'lucide-react';

export function uid() { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
.cb-root { --paper:#F2EEE3; --paper-dark:#E7DFCB; --ink:#2B2620; --ink-soft:#786F5C;
  --cover:#8C2F2F; --cover-dark:#6E2424; --gilt:#A9814E; --sage:#4C6B4F; --line:#D8CEB8; --card:#FBF9F1;
  font-family:'Manrope',system-ui,sans-serif; color:var(--ink); background:var(--paper); min-height:100vh; }
.cb-serif { font-family:'Lora',Georgia,serif; }
.cb-btn { display:inline-flex; align-items:center; gap:.5rem; border-radius:3px; padding:.6rem 1.15rem; font-weight:600; font-size:.9rem; cursor:pointer; transition:background .15s,transform .1s; border:1px solid transparent; }
.cb-btn:active { transform:scale(.98); }
.cb-btn:disabled { opacity:.5; cursor:not-allowed; }
.cb-btn-primary { background:var(--cover); color:#F6EEE6; }
.cb-btn-primary:hover { background:var(--cover-dark); }
.cb-btn-outline { background:transparent; color:var(--ink); border-color:var(--line); }
.cb-btn-outline:hover { border-color:var(--cover); color:var(--cover); }
.cb-btn-ghost { background:transparent; color:var(--ink-soft); }
.cb-btn-ghost:hover { color:var(--ink); }
.cb-card { background:var(--card); border:1px solid var(--line); border-radius:2px; }
.cb-input { width:100%; border:1px solid var(--line); background:var(--card); border-radius:2px; padding:.55rem .7rem; font-family:'Manrope',sans-serif; font-size:.92rem; color:var(--ink); }
.cb-input:focus { outline:none; border-color:var(--cover); }
.cb-ribbon { position:relative; height:.5rem; background:var(--paper-dark); border-radius:99px; overflow:hidden; }
.cb-ribbon-fill { height:100%; background:var(--gilt); border-radius:99px; transition:width .3s ease; }
`;

export function Button({ variant = 'primary', className = '', ...props }) {
  const cls = variant === 'primary' ? 'cb-btn cb-btn-primary' : variant === 'outline' ? 'cb-btn cb-btn-outline' : 'cb-btn cb-btn-ghost';
  return <button className={`${cls} ${className}`} {...props} />;
}

export function ProgressRibbon({ percent, label }) {
  return (
    <div>
      {label && <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--ink-soft)' }}><span>{label}</span><span>{percent}%</span></div>}
      <div className="cb-ribbon"><div className="cb-ribbon-fill" style={{ width: `${percent}%` }} /></div>
    </div>
  );
}

export function TopBar({ onHome, right }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button onClick={onHome} className="text-sm flex items-center gap-1" style={{ color: 'var(--ink-soft)' }}>
        <ChevronLeft size={15} /> На головну
      </button>
      {right}
    </div>
  );
}

function renderInline(str, key) {
  const parts = String(str).split(/(\*\*[^*]+\*\*)/g);
  return <React.Fragment key={key}>{parts.map((p, i) => p.startsWith('**') && p.endsWith('**')
    ? <strong key={i}>{p.slice(2, -2)}</strong>
    : <React.Fragment key={i}>{p}</React.Fragment>)}</React.Fragment>;
}
export function renderContent(text) {
  if (!text) return null;
  const blocks = String(text).split(/\n\s*\n/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length && lines.every(l => l.startsWith('- '))) {
      return <ul key={i} className="list-disc pl-5 space-y-1 my-3">{lines.map((l, j) => <li key={j} className="cb-serif" style={{ lineHeight: 1.7 }}>{renderInline(l.slice(2), j)}</li>)}</ul>;
    }
    if (trimmed.startsWith('## ')) {
      return <h3 key={i} className="cb-serif" style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '1.4rem', marginBottom: '.4rem' }}>{trimmed.slice(3)}</h3>;
    }
    if (!trimmed) return null;
    return <p key={i} className="cb-serif" style={{ lineHeight: 1.8, marginBottom: '1rem', color: 'var(--ink)' }}>{renderInline(trimmed, i)}</p>;
  });
}

export function sanitizeKey(s) { return String(s || '').trim().replace(/\s+/g, '_').replace(/["'\\/]/g, ''); }
