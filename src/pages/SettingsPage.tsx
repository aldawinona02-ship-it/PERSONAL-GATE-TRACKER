import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Save,
  Check,
  AlertTriangle,
  FileJson,
  Moon,
  Sun,
  GraduationCap,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    loadDemoData,
    resetAllData,
    exportData,
    importData,
  } = useApp();

  const [examDate, setExamDate] = useState(settings.examDate || '2028-02-05');
  const [dailyTargetHours, setDailyTargetHours] = useState(
    String(Math.round(settings.dailyStudyTargetMinutes / 60) || 3)
  );
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(
    String(Math.round(settings.weeklyStudyTargetMinutes / 60) || 20)
  );
  const [quizSize, setQuizSize] = useState(String(settings.quizQuestionCount || 10));
  const [isSaved, setIsSaved] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      examDate,
      dailyStudyTargetMinutes: Math.max(30, Number(dailyTargetHours) * 60),
      weeklyStudyTargetMinutes: Math.max(120, Number(weeklyTargetHours) * 60),
      quizQuestionCount: Number(quizSize) || 10,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportJSON = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GATE_2028_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) return;
    const success = importData(importJsonText.trim());
    if (success) {
      setImportStatus('success');
      setImportJsonText('');
    } else {
      setImportStatus('error');
    }
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          setImportStatus('success');
        } else {
          setImportStatus('error');
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
          Preparation Settings
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
          Target dates, daily hours, backup/restore, and personal preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Examination & Study Target Settings */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Exam & Study Target Configuration
              </h3>
              <p className="text-xs text-neutral-500">
                Adjust exam schedule and daily commitment targets
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Examination
              </label>
              <input
                type="text"
                disabled
                value={settings.examName}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Target Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Daily Target (Hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={dailyTargetHours}
                  onChange={(e) => setDailyTargetHours(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Weekly Target (Hours)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={weeklyTargetHours}
                  onChange={(e) => setWeeklyTargetHours(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Default Quiz Question Size
              </label>
              <select
                value={quizSize}
                onChange={(e) => setQuizSize(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95"
              >
                {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                <span>{isSaved ? 'Settings Saved!' : 'Save Target Settings'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Data Persistence, Backup & Restore */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 space-y-6">
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Data Backup & Restore
              </h3>
              <p className="text-xs text-neutral-500">
                Export and import all sessions, notes, quizzes, and mistakes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Export */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  Export Full Backup (.json)
                </p>
                <p className="text-[11px] text-neutral-500">
                  Save your entire preparation state locally.
                </p>
              </div>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Import file upload */}
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">
                    Restore from Backup
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Upload a previously exported JSON backup file.
                  </p>
                </div>
                <label className="flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-700 shadow-xs cursor-pointer hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {importStatus === 'success' && (
                <div className="rounded-xl bg-emerald-50 p-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  ✅ Data successfully restored!
                </div>
              )}
              {importStatus === 'error' && (
                <div className="rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  ❌ Invalid JSON file format.
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => {
                  if (confirm('Load demo dataset? This will add sample study sessions, notes, and mistakes.')) {
                    loadDemoData();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
              >
                <Sparkles className="h-4 w-4" />
                <span>Load Sample Data</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all preparation data? This cannot be undone.')) {
                    resetAllData();
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
