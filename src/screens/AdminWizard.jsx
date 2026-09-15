import React, { useState } from 'react';
import {
  Plus, Trash2, X, Check, ArrowRight, ChevronLeft, Layers, Target,
} from 'lucide-react';
import { Button, TopBar, uid } from '../ui.jsx';

function emptyCourse() {
  return { id: null, title: '', description: '', goals: [''], modules: [] };
}

export default function AdminWizard({ draft, onPublish, onCancel }) {
  const [step, setStep] = useState(1);
  const [course, setCourse] = useState(draft ? JSON.parse(JSON.stringify(draft)) : emptyCourse());
  const [lessonCursor, setLessonCursor] = useState({ idx: 0 });
  const steps = ['Основне', 'Структура', 'Наповнення', 'Тести', 'Перегляд'];

  const update = (patch) => setCourse(c => ({ ...c, ...patch }));

  const addGoal = () => update({ goals: [...course.goals, ''] });
  const setGoal = (i, v) => update({ goals: course.goals.map((g, idx) => idx === i ? v : g) });
  const removeGoal = (i) => update({ goals: course.goals.filter((_, idx) => idx !== i) });

  const addModule = () => update({ modules: [...course.modules, { id: uid(), title: '', lessons: [] }] });
  const setModuleTitle = (mi, v) => update({ modules: course.modules.map((m, i) => i === mi ? { ...m, title: v } : m) });
  const removeModule = (mi) => update({ modules: course.modules.filter((_, i) => i !== mi) });
  const addLesson = (mi) => update({ modules: course.modules.map((m, i) => i === mi ? { ...m, lessons: [...m.lessons, { id: uid(), title: '', content: '', quiz: [] }] } : m) });
  const setLessonTitle = (mi, li, v) => update({ modules: course.modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, title: v } : l) } : m) });
  const removeLesson = (mi, li) => update({ modules: course.modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m) });
  const setLessonContent = (mi, li, v) => update({ modules: course.modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, content: v } : l) } : m) });

  const setLessonQuiz = (mi, li, quiz) => update({ modules: course.modules.map((m, i) => i === mi ? { ...m, lessons: m.lessons.map((l, j) => j === li ? { ...l, quiz } : l) } : m) });
  const addQuestion = (mi, li) => {
    const lesson = course.modules[mi].lessons[li];
    setLessonQuiz(mi, li, [...lesson.quiz, { id: uid(), question: '', options: ['', ''], correctIndex: 0, explanation: '' }]);
  };
  const updateQuestion = (mi, li, qi, patch) => {
    const lesson = course.modules[mi].lessons[li];
    setLessonQuiz(mi, li, lesson.quiz.map((q, i) => i === qi ? { ...q, ...patch } : q));
  };
  const removeQuestion = (mi, li, qi) => {
    const lesson = course.modules[mi].lessons[li];
    setLessonQuiz(mi, li, lesson.quiz.filter((_, i) => i !== qi));
  };

  const allLessons = course.modules.flatMap((m, mi) => m.lessons.map((l, li) => ({ m, mi, l, li })));
  const canProceedFrom2 = course.modules.length > 0 && course.modules.every(m => m.title.trim() && m.lessons.length > 0 && m.lessons.every(l => l.title.trim()));

  async function handlePublishClick() {
    const id = course.id || uid();
    const finalCourse = { ...course, id, updatedAt: Date.now() };
    await onPublish(finalCourse);
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <TopBar onHome={onCancel} />
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button onClick={() => setStep(i + 1)} className="text-xs px-2.5 py-1 rounded-full" style={{
              background: step === i + 1 ? 'var(--cover)' : 'transparent',
              color: step === i + 1 ? '#F6EEE6' : 'var(--ink-soft)',
              border: `1px solid ${step === i + 1 ? 'var(--cover)' : 'var(--line)'}`,
            }}>{i + 1}. {s}</button>
            {i < steps.length - 1 && <div style={{ width: 14, height: 1, background: 'var(--line)' }} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>Назва курсу</label>
            <input className="cb-input mt-1" value={course.title} onChange={e => update({ title: e.target.value })} placeholder="Напр. Як сприймати фідбек" />
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>Короткий опис</label>
            <textarea className="cb-input mt-1" rows={3} value={course.description} onChange={e => update({ description: e.target.value })} placeholder="Про що курс і навіщо він" />
          </div>
          <div>
            <label className="text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>Цілі курсу</label>
            <div className="space-y-2 mt-1">
              {course.goals.map((g, i) => (
                <div key={i} className="flex gap-2">
                  <input className="cb-input" value={g} onChange={e => setGoal(i, e.target.value)} placeholder="Після курсу співробітник зможе..." />
                  <Button variant="ghost" onClick={() => removeGoal(i)}><X size={16} /></Button>
                </div>
              ))}
              <Button variant="outline" onClick={addGoal}><Plus size={14} /> Додати ціль</Button>
            </div>
          </div>
          <div className="flex justify-end"><Button onClick={() => setStep(2)} disabled={!course.title.trim()}>Далі <ArrowRight size={16} /></Button></div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {course.modules.map((m, mi) => (
            <div key={m.id} className="cb-card p-4">
              <div className="flex gap-2 items-center mb-3">
                <Layers size={16} color="var(--gilt)" />
                <input className="cb-input" value={m.title} onChange={e => setModuleTitle(mi, e.target.value)} placeholder={`Розділ ${mi + 1}: назва`} />
                <Button variant="ghost" onClick={() => removeModule(mi)}><Trash2 size={16} /></Button>
              </div>
              <div className="pl-6 space-y-2">
                {m.lessons.map((l, li) => (
                  <div key={l.id} className="flex gap-2">
                    <input className="cb-input" value={l.title} onChange={e => setLessonTitle(mi, li, e.target.value)} placeholder={`Тема ${li + 1}`} />
                    <Button variant="ghost" onClick={() => removeLesson(mi, li)}><X size={16} /></Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => addLesson(mi)}><Plus size={14} /> Додати тему</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addModule}><Plus size={14} /> Додати розділ</Button>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(1)}><ChevronLeft size={16} /> Назад</Button>
            <Button onClick={() => setStep(3)} disabled={!canProceedFrom2}>Далі <ArrowRight size={16} /></Button>
          </div>
        </div>
      )}

      {step === 3 && allLessons.length > 0 && (() => {
        const idx = Math.min(lessonCursor.idx || 0, allLessons.length - 1);
        const cur = allLessons[idx];
        return (
          <div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {allLessons.map((it, i) => (
                <button key={it.l.id} onClick={() => setLessonCursor({ idx: i })} className="text-xs px-2 py-1 rounded" style={{
                  background: i === idx ? 'var(--cover)' : 'var(--paper-dark)',
                  color: i === idx ? '#F6EEE6' : 'var(--ink-soft)',
                }}>{it.l.title || `Тема ${i + 1}`}</button>
              ))}
            </div>
            <p className="text-xs mb-1" style={{ color: 'var(--gilt)' }}>{cur.m.title}</p>
            <h3 className="cb-serif font-semibold mb-3">{cur.l.title}</h3>
            <textarea className="cb-input cb-serif" rows={12} value={cur.l.content}
              onChange={e => setLessonContent(cur.mi, cur.li, e.target.value)}
              placeholder={'Вставте текст теми.\n\nПорожній рядок — новий абзац.\n## Заголовок\n- пункт списку\n**жирний текст**'} />
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setStep(2)}><ChevronLeft size={16} /> Назад</Button>
              <Button onClick={() => setStep(4)}>Далі <ArrowRight size={16} /></Button>
            </div>
          </div>
        );
      })()}

      {step === 4 && (
        <div className="space-y-6">
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>Тести — для самоперевірки, результат не фіксується жорстко. Можна залишити тему без тесту.</p>
          {allLessons.map(({ m, l, mi, li }) => (
            <div key={l.id} className="cb-card p-4">
              <p className="text-xs" style={{ color: 'var(--gilt)' }}>{m.title}</p>
              <h4 className="cb-serif font-semibold mb-2">{l.title || 'Без назви'}</h4>
              <div className="space-y-3">
                {l.quiz.map((q, qi) => (
                  <div key={q.id} className="border-l-2 pl-3" style={{ borderColor: 'var(--line)' }}>
                    <div className="flex gap-2">
                      <input className="cb-input" value={q.question} onChange={e => updateQuestion(mi, li, qi, { question: e.target.value })} placeholder="Питання" />
                      <Button variant="ghost" onClick={() => removeQuestion(mi, li, qi)}><Trash2 size={15} /></Button>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <input type="radio" checked={q.correctIndex === oi} onChange={() => updateQuestion(mi, li, qi, { correctIndex: oi })} />
                          <input className="cb-input" value={opt} onChange={e => updateQuestion(mi, li, qi, { options: q.options.map((o, k) => k === oi ? e.target.value : o) })} placeholder={`Варіант ${oi + 1}`} />
                          {q.options.length > 2 && <Button variant="ghost" onClick={() => updateQuestion(mi, li, qi, { options: q.options.filter((_, k) => k !== oi) })}><X size={14} /></Button>}
                        </div>
                      ))}
                      {q.options.length < 5 && <Button variant="ghost" onClick={() => updateQuestion(mi, li, qi, { options: [...q.options, ''] })}><Plus size={13} /> Варіант</Button>}
                    </div>
                    <input className="cb-input mt-2" value={q.explanation} onChange={e => updateQuestion(mi, li, qi, { explanation: e.target.value })} placeholder="Пояснення правильної відповіді (необов'язково)" />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addQuestion(mi, li)}><Plus size={14} /> Додати питання</Button>
              </div>
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep(3)}><ChevronLeft size={16} /> Назад</Button>
            <Button onClick={() => setStep(5)}>Далі <ArrowRight size={16} /></Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h3 className="cb-serif text-lg font-semibold mb-1">{course.title}</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--ink-soft)' }}>{course.description}</p>
          {course.goals.filter(Boolean).length > 0 && (
            <div className="mb-4">
              {course.goals.filter(Boolean).map((g, i) => (
                <div key={i} className="flex gap-2 text-sm mb-1"><Target size={14} color="var(--gilt)" className="mt-0.5 shrink-0" /><span>{g}</span></div>
              ))}
            </div>
          )}
          <div className="space-y-2 mb-6">
            {course.modules.map((m, mi) => (
              <div key={m.id} className="cb-card p-3">
                <p className="cb-serif font-semibold text-sm">{mi + 1}. {m.title}</p>
                <ul className="text-xs mt-1 space-y-0.5" style={{ color: 'var(--ink-soft)' }}>
                  {m.lessons.map((l, li) => <li key={l.id}>— {l.title} {l.quiz.length > 0 ? `· тест (${l.quiz.length})` : ''}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(4)}><ChevronLeft size={16} /> Назад</Button>
            <Button onClick={handlePublishClick}><Check size={16} /> Опублікувати курс</Button>
          </div>
        </div>
      )}
    </div>
  );
}
