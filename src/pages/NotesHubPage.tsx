import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Search,
  BookOpen,
  Edit,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const NotesHubPage: React.FC = () => {
  const { notes, syllabus, navigateToTopic } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedTopicId, setCopiedTopicId] = useState<string | null>(null);

  // Filtered notes list
  const notesList = useMemo(() => {
    const list: Array<{
      subject: any;
      topic: any;
      note: any;
    }> = [];

    syllabus.forEach((s) => {
      if (selectedSubjectId !== 'all' && s.id !== selectedSubjectId) return;

      s.topics.forEach((t) => {
        const note = notes[t.id];
        const hasContent =
          note &&
          (note.importantConcepts ||
            note.importantFormulas ||
            note.examples ||
            note.myUnderstanding ||
            note.doubts);

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTopic = t.name.toLowerCase().includes(q);
          const matchSubj = s.name.toLowerCase().includes(q);
          const matchText =
            note &&
            `${note.importantConcepts} ${note.importantFormulas} ${note.examples} ${note.myUnderstanding}`
              .toLowerCase()
              .includes(q);

          if (matchTopic || matchSubj || matchText) {
            list.push({
              subject: s,
              topic: t,
              note: note || {
                importantConcepts: '',
                importantFormulas: '',
                examples: '',
                myUnderstanding: '',
                doubts: '',
              },
            });
          }
        } else if (hasContent) {
          list.push({ subject: s, topic: t, note });
        }
      });
    });

    return list;
  }, [syllabus, notes, selectedSubjectId, searchQuery]);

  const handleCopyNote = (topicId: string, topicName: string, note: any) => {
    const content = `# GATE 2028: ${topicName} Revision Cheatsheet\n\n## Important Concepts\n${
      note.importantConcepts || 'None recorded.'
    }\n\n## Important Formulas\n${
      note.importantFormulas || 'None recorded.'
    }\n\n## Solved Examples\n${note.examples || 'None recorded.'}\n\n## Intuition\n${
      note.myUnderstanding || 'None recorded.'
    }`;

    navigator.clipboard.writeText(content);
    setCopiedTopicId(topicId);
    setTimeout(() => setCopiedTopicId(null), 2000);
  };

  const handleExportAllMarkdown = () => {
    let fullDoc = `# GATE 2028 DA Complete Digital Notes & Cheatsheets\nExported: ${new Date().toLocaleDateString()}\n\n`;

    notesList.forEach(({ subject, topic, note }) => {
      fullDoc += `\n---\n# ${subject.name} → ${topic.name}\n\n`;
      if (note.importantConcepts) fullDoc += `### Important Concepts\n${note.importantConcepts}\n\n`;
      if (note.importantFormulas) fullDoc += `### Important Formulas\n${note.importantFormulas}\n\n`;
      if (note.examples) fullDoc += `### Examples & PYQs\n${note.examples}\n\n`;
      if (note.myUnderstanding) fullDoc += `### Intuition\n${note.myUnderstanding}\n\n`;
      if (note.doubts) fullDoc += `### Doubts\n${note.doubts}\n\n`;
    });

    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GATE_2028_DA_Notes_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white sm:text-3xl">
            Digital Notes & Cheatsheets
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Centralized repository for GATE DA formulas, definitions, and intuitive summaries
          </p>
        </div>

        <button
          onClick={handleExportAllMarkdown}
          className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-700 shadow-xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
        >
          <Download className="h-4 w-4 text-neutral-500" />
          <span>Export All to Markdown (.md)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes by formula, concept, or topic name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-xs text-neutral-900 focus:border-blue-500 focus:bg-white dark:focus:bg-neutral-800 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
        >
          <option value="all">All Subjects</option>
          {syllabus.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {notesList.length === 0 ? (
          <div className="col-span-2 rounded-3xl border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
            No notes found matching your filters. Open any topic in the syllabus to add notes or generate them with AI.
          </div>
        ) : (
          notesList.map(({ subject, topic, note }) => (
            <div
              key={topic.id}
              className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs transition hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-700"
            >
              <div>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                  <div>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {subject.name}
                    </span>
                    <h3 className="mt-1 text-sm font-bold text-neutral-900 dark:text-white">
                      {topic.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyNote(topic.id, topic.name, note)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                      title="Copy Cheatsheet"
                    >
                      {copiedTopicId === topic.id ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => navigateToTopic(topic.id, 'notes')}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
                      title="Edit Notes"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Content previews */}
                <div className="mt-4 space-y-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {note.importantConcepts && (
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block mb-1 text-[11px]">
                        📌 Concepts:
                      </span>
                      <p className="line-clamp-3 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-800/60 p-2.5 rounded-xl">
                        {note.importantConcepts}
                      </p>
                    </div>
                  )}

                  {note.importantFormulas && (
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block mb-1 text-[11px]">
                        📐 Formulas:
                      </span>
                      <p className="line-clamp-3 font-mono text-[11px] bg-neutral-50 dark:bg-neutral-800/60 p-2.5 rounded-xl">
                        {note.importantFormulas}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400">
                  {note.lastUpdated ? `Updated: ${new Date(note.lastUpdated).toLocaleDateString()}` : 'Draft'}
                </span>

                <button
                  onClick={() => navigateToTopic(topic.id, 'notes')}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
                >
                  <span>Open Full Editor</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
