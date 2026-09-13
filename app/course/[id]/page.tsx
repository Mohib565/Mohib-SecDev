'use client';

import React, { useState, useEffect } from 'react';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] flex items-center justify-center text-xs font-mono text-slate-400">
        Loading module curriculum...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-24 antialiased">
      {/* Top Header Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              ← Back to Vault
            </Link>
            <span className="text-slate-300">|</span>
            <span className="font-extrabold text-slate-900 text-sm tracking-tight truncate max-w-[280px]">
              {course?.title || 'Course Details'}
            </span>
          </div>

          <Link
            href="/admin"
            className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700 transition"
          >
            Edit course ✏️
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Markdown Reader Pane */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              {course?.category || 'Technical Track'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
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
                  h1: ({ children }) => (
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-7 mb-3 tracking-tight border-b border-slate-100 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3 tracking-tight">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-4 mb-2">
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

          {/* Downloadable PDF Section */}
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
        </div>

        {/* Right Side: Curriculum Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Curriculum Lessons</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{modules.length} lessons &bull; Self-paced</p>
            </div>

            <div className="space-y-2">
              {modules.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m)}
                  className={`w-full text-left p-3.5 rounded-2xl text-xs font-semibold transition flex items-center justify-between border ${
                    selectedModule?.id === m.id
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">#{idx + 1}</span>
                    <span className="truncate">{m.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">Read</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}