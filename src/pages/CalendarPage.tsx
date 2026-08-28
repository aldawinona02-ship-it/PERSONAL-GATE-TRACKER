import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Flame,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { studySessions, syllabus, setIsAddSessionOpen, todayStr, navigateToTopic } = useApp();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(todayStr);
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Map study sessions by date
  const sessionsByDate = useMemo(() => {
    const map: Record<string, typeof studySessions> = {};
    studySessions.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [studySessions]);

  // Generate calendar grid days
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      sessionsCount: number;
      totalMinutes: number;
    }> = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const m = month === 0 ? 12 : month;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const sess = sessionsByDate[dateStr] || [];
      const totalMinutes = sess.reduce((acc, s) => acc + s.durationMinutes, 0);

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        sessionsCount: sess.length,
        totalMinutes,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const sess = sessionsByDate[dateStr] || [];
      const totalMinutes = sess.reduce((acc, s) => acc + s.durationMinutes, 0);

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        sessionsCount: sess.length,
        totalMinutes,
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const sess = sessionsByDate[dateStr] || [];
      const totalMinutes = sess.reduce((acc, s) => acc + s.durationMinutes, 0);

      days.push({
        dateStr,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        sessionsCount: sess.length,
        totalMinutes,
      });
    }

    return days;
  }, [year, month, sessionsByDate, todayStr]);

  // Selected date details
  const selectedSessions = sessionsByDate[selectedDateStr] || [];
  const selectedDateTotalMinutes = selectedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Month Statistics
  const monthTotalMinutes = useMemo(() => {
    return studySessions
      .filter((s) => s.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [studySessions, year, month]);

  const monthActiveDays = useMemo(() => {
    const dates = new Set(
      studySessions
        .filter((s) => s.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
        .map((s) => s.date)
    );
    return dates.size;
  }, [studySessions, year, month]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Study Calendar
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Visual study consistency, daily logs, and preparation timelines
          </p>
        </div>

        {/* Month Summary stats */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-neutral-500">
              {monthName} Study Time
            </span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400">
              {Math.floor(monthTotalMinutes / 60)}h {monthTotalMinutes % 60}m
            </span>
          </div>
          <div className="h-7 w-px bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            {monthActiveDays} Active Study Days
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar View (2 Columns) */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
          {/* Controls Bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                {monthName} {year}
              </h2>
              <button
                onClick={handleGoToToday}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-bold text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="rounded-lg border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Grid */}
          <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day) => {
              const isSelected = selectedDateStr === day.dateStr;

              // Heatmap intensity classes
              let heatmapClass = 'bg-neutral-50/50 dark:bg-neutral-800/30';
              if (day.totalMinutes > 0) {
                if (day.totalMinutes >= 180) {
                  heatmapClass =
                    'bg-blue-100/90 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 border-blue-300 dark:border-blue-800';
                } else if (day.totalMinutes >= 90) {
                  heatmapClass =
                    'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900';
                } else {
                  heatmapClass =
                    'bg-blue-50/40 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-100 dark:border-neutral-800';
                }
              }

              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDateStr(day.dateStr)}
                  className={`relative flex min-h-[72px] flex-col justify-between rounded-2xl border p-2 text-left transition ${
                    isSelected
                      ? 'ring-2 ring-blue-600 dark:ring-blue-400 border-blue-600 dark:border-blue-400 z-10'
                      : 'border-neutral-100 dark:border-neutral-800/60'
                  } ${heatmapClass} ${
                    !day.isCurrentMonth ? 'opacity-30' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                        day.isToday
                          ? 'bg-blue-600 text-white'
                          : 'text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {day.totalMinutes > 0 && (
                      <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </div>

                  {day.totalMinutes > 0 && (
                    <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
                      {Math.floor(day.totalMinutes / 60) > 0
                        ? `${Math.floor(day.totalMinutes / 60)}h `
                        : ''}
                      {day.totalMinutes % 60}m
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Detail Drawer (1 Column) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {selectedDateStr === todayStr ? 'Today' : selectedDateStr}
                </h3>
                <p className="text-xs text-neutral-500">
                  {selectedDateTotalMinutes > 0
                    ? `Total: ${Math.floor(selectedDateTotalMinutes / 60)}h ${
                        selectedDateTotalMinutes % 60
                      }m studied`
                    : 'No study recorded for this day'}
                </p>
              </div>

              <button
                onClick={() => setIsAddSessionOpen(true)}
                className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Log</span>
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {selectedSessions.length === 0 ? (
                <div className="py-12 text-center text-xs text-neutral-400">
                  No sessions logged on {selectedDateStr}. Click "+ Log" to record study time.
                </div>
              ) : (
                selectedSessions.map((session) => {
                  const subject = syllabus.find((s) => s.id === session.subjectId);
                  const topic = subject?.topics.find((t) => t.id === session.topicId);
                  return (
                    <div
                      key={session.id}
                      className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-3.5 dark:border-neutral-800 dark:bg-neutral-800/40"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {topic?.name || 'Topic'}
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {session.durationMinutes} mins
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
                        {session.description}
                      </p>
                      {session.importantPoints && (
                        <p className="mt-1 text-[11px] text-neutral-500">
                          💡 {session.importantPoints}
                        </p>
                      )}
                      {topic && (
                        <button
                          onClick={() => navigateToTopic(topic.id, 'overview')}
                          className="mt-2 text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                        >
                          View Topic Details →
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
