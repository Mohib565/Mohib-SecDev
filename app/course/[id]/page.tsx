'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLessonsDropdownOpen, setIsLessonsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadCourseAndModules() {
      if (!courseId) return;

      const { data: cData } = await supabase
        .from('topics')
        .select('*')
        .eq('id', courseId)
        .single();

      const { data: mData } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (cData) setCourse(cData);
      if (mData && mData.length > 0) {
        setModules(mData);
        setSelectedModule(mData[0]);
      }
      setLoading(false);
    }

    loadCourseAndModules();
  }, [courseId]);

  // Click outside to close lessons dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLessonsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center text-xs font-mono text-slate-400">
        Loading module curriculum...
      </div>
    );
  }

  // Current Lesson Index for Next / Previous buttons
  const currentIndex = modules.findIndex((m) => m.id === selectedModule?.id);
  const prevModule = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-24 antialiased">
      {/* Top Header Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
          {/* Left: Back Link & Title */}
          <div className="flex items-center gap-2 sm:gap-3 truncate">
            <Link href="/" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 flex-shrink-0">
              ← Back to Vault
            </Link>
            <span className="text-slate-300">|</span>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
              {course?.title || 'Course Details'}
            </span>
          </div>

          {/* Right: Lessons Menu Button & Edit Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Lessons Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsLessonsDropdownOpen(!isLessonsDropdownOpen)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
              >
                <span>📚</span>
                <span>Lessons ({modules.length})</span>
                <span className="text-[10px] text-emerald-700">▼</span>
              </button>

              {/* Dropdown Popup List */}
              {isLessonsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 max-h-96 overflow-y-auto space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Course Curriculum</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      {currentIndex + 1} of {modules.length}
                    </span>
                  </div>
                  {modules.map((m, idx) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModule(m);
                        setIsLessonsDropdownOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                        selectedModule?.id === m.id
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`font-mono text-[10px] ${selectedModule?.id === m.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                          #{idx + 1}
                        </span>
                        <span className="truncate">{m.title}</span>
                      </div>
                      {selectedModule?.id === m.id && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/admin"
              className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-semibold text-slate-700 transition hidden sm:inline-block"
            >
              Edit course ✏️
            </Link>
          </div>
        </div>
      </div>

      {/* Main Full-Width Centered Reading Workspace */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-sm space-y-8">
          {/* Header Tag & Title */}
          <div className="border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                {course?.category || 'Technical Track'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Lesson {currentIndex + 1} of {modules.length}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {selectedModule?.title || 'Module Notes'}
            </h1>
          </div>

          {/* Styled Markdown & LaTeX Math Viewer */}
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed overflow-hidden">
            {selectedModule?.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Full Control Image Renderer with 50%, 75%, 100% Options
                  img: ({ node, ...props }) => {
                    const src = String(props.src || '');
                    const alt = String(props.alt || '');

                    let targetWidth = '100%';

                    if (src.includes('#50') || alt.includes('50%')) {
                      targetWidth = '50%';
                    } else if (src.includes('#75') || alt.includes('75%')) {
                      targetWidth = '75%';
                    } else if (src.includes('#100') || alt.includes('100%')) {
                      targetWidth = '100%';
                    }

                    const displayAlt = alt.replace(/\|\s*(50%|75%|100%)/g, '').replace(/#(50|75|100)/g, '').trim();

                    return (
                      <span
                        className="not-prose my-6 text-center"
                        style={{
                          width: targetWidth,
                          maxWidth: '100%',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          display: 'block'
                        }}
                      >
                        <img
                          {...props}
                          style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                          }}
                          loading="lazy"
                        />
                        {displayAlt && (
                          <span className="block text-center text-[11px] text-slate-400 font-mono mt-2">
                            {displayAlt}
                          </span>
                        )}
                      </span>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-4 tracking-tight border-b border-slate-100 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-7 mb-3 tracking-tight">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="leading-relaxed text-slate-600 mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1.5 mb-4 text-slate-600">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-slate-600">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">
                      {children}
                    </li>
                  ),
                  hr: () => (
                    <hr className="border-slate-200 my-6" />
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-emerald-500 bg-emerald-50/70 p-4 rounded-r-xl my-4 text-slate-700 text-xs sm:text-sm italic">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-5 border border-slate-200 rounded-2xl shadow-sm">
                      <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                      {children}
                    </thead>
                  ),
                  th: ({ children }) => (
                    <th className="p-3.5 font-bold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="p-3.5 border-t border-slate-100">
                      {children}
                    </td>
                  ),
                  code: ({ className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-slate-100 text-emerald-800 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200 font-semibold" {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="my-5 rounded-2xl overflow-hidden bg-[#0c1613] text-emerald-300 font-mono text-xs p-4 border border-slate-800 shadow-md">
                        <pre className="overflow-x-auto">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                }}
              >
                {selectedModule.content}
              </ReactMarkdown>
            ) : (
              <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No technical notes written for this module yet. Add notes from Creator Studio.
              </div>
            )}
          </div>

          {/* Downloadable PDF Section (Optional Resource) */}
          {selectedModule?.pdf_url && (
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                <span>📄</span> Attached Resource / Slide Deck
              </div>
              <a
                href={selectedModule.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
              >
                Download PDF ↗
              </a>
            </div>
          )}

          {/* Bottom Next / Previous Lesson Navigation Bar */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
            {prevModule ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedModule(prevModule);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
              >
                <span>←</span>
                <span className="truncate max-w-[140px] sm:max-w-xs">{prevModule.title}</span>
              </button>
            ) : (
              <div />
            )}

            {nextModule ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedModule(nextModule);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-sm ml-auto"
              >
                <span className="truncate max-w-[140px] sm:max-w-xs">{nextModule.title}</span>
                <span>→</span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}