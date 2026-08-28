import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Clock, Star, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AddStudySessionModal: React.FC = () => {
  const {
    isAddSessionOpen,
    setIsAddSessionOpen,
    syllabus,
    addStudySession,
    todayStr,
    selectedTopicId,
  } = useApp();

  const [date, setDate] = useState(todayStr);
  const [subjectId, setSubjectId] = useState(syllabus[0]?.id || '');
  const [topicId, setTopicId] = useState(syllabus[0]?.topics[0]?.id || '');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [description, setDescription] = useState('');
  const [importantPoints, setImportantPoints] = useState('');
  const [doubts, setDoubts] = useState('');
  const [confidence, setConfidence] = useState(4);
  const [completed, setCompleted] = useState(true);
  const [error, setError] = useState('');

  // Prepopulate with selected topic if opened from topic page
  useEffect(() => {
    if (selectedTopicId) {
      for (const subj of syllabus) {
        const found = subj.topics.find((t) => t.id === selectedTopicId);
        if (found) {
          setSubjectId(subj.id);
          setTopicId(found.id);
          break;
        }
      }
    }
  }, [selectedTopicId, syllabus, isAddSessionOpen]);

  // Keep topic cascading when subject changes
  const selectedSubject = syllabus.find((s) => s.id === subjectId) || syllabus[0];
  const availableTopics = selectedSubject?.topics || [];

  useEffect(() => {
    if (availableTopics.length > 0) {
      const topicExistsInSubject = availableTopics.some((t) => t.id === topicId);
      if (!topicExistsInSubject) {
        setTopicId(availableTopics[0].id);
      }
    }
  }, [subjectId, availableTopics, topicId]);

  // Auto calculate duration from startTime and endTime
  useEffect(() => {
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      if (!isNaN(sh) && !isNaN(sm) && !isNaN(eh) && !isNaN(em)) {
        let diff = (eh * 60 + em) - (sh * 60 + sm);
        if (diff < 0) diff += 24 * 60; // crossed midnight
        if (diff > 0) {
          setDurationMinutes(diff);
        }
      }
    }
  }, [startTime, endTime]);

  // Escape key listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAddSessionOpen) {
        e.preventDefault();
        setIsAddSessionOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddSessionOpen, setIsAddSessionOpen]);

  if (!isAddSessionOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a brief description of what you studied.');
      return;
    }
    if (durationMinutes <= 0) {
      setError('Duration must be greater than 0 minutes.');
      return;
    }

    addStudySession({
      date,
      subjectId,
      topicId,
      startTime,
      endTime,
      durationMinutes,
      description: description.trim(),
      importantPoints: importantPoints.trim(),
      doubts: doubts.trim(),
      confidence,
      completed,
    });

    // Reset and close
    setDescription('');
    setImportantPoints('');
    setDoubts('');
    setError('');
    setIsAddSessionOpen(false);
  };

  return (
    <div
      onClick={() => setIsAddSessionOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs overflow-y-auto cursor-pointer"
    >
      <div
        id="modal-add-study-session"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl cursor-default rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Log Study Session
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Track your topic study time and key takeaways
              </p>
            </div>
          </div>
          <button
            id="btn-close-add-session-modal"
            onClick={() => setIsAddSessionOpen(false)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Date & Subject */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Date
              </label>
              <input
                id="input-session-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Subject
              </label>
              <select
                id="select-session-subject"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                {syllabus.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic (Cascading Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Topic
            </label>
            <select
              id="select-session-topic"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            >
              {availableTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time, End Time & Auto-Calculated Duration */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Start Time
              </label>
              <input
                id="input-session-start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                End Time
              </label>
              <input
                id="input-session-end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Duration (Mins)
              </label>
              <input
                id="input-session-duration"
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-xs font-bold text-blue-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 sm:text-sm"
              />
            </div>
          </div>

          {/* What did I study? */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              What did I study? <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="input-session-description"
              rows={2}
              placeholder="e.g. Normalization normal forms, solved 10 PYQs on candidate keys..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white placeholder:text-neutral-400"
              required
            />
          </div>

          {/* Important Points & Doubts */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Important Points / Formulas
              </label>
              <textarea
                id="input-session-important-points"
                rows={2}
                placeholder="Key theorems, formulas, or short notes..."
                value={importantPoints}
                onChange={(e) => setImportantPoints(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Doubts / Unclear Concepts
              </label>
              <textarea
                id="input-session-doubts"
                rows={2}
                placeholder="Questions to ask AI or revisit later..."
                value={doubts}
                onChange={(e) => setDoubts(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>
          </div>

          {/* Confidence Stars & Completion Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/40">
            <div>
              <span className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Confidence Level
              </span>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setConfidence(star)}
                    className="p-0.5 transition hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= confidence
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-300 dark:text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  {confidence === 5
                    ? 'Mastered'
                    : confidence === 4
                    ? 'High'
                    : confidence === 3
                    ? 'Moderate'
                    : confidence === 2
                    ? 'Low'
                    : 'Struggling'}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                id="checkbox-session-completed"
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Mark as Completed Session
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddSessionOpen(false)}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              id="btn-save-study-session"
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Save Session & Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
