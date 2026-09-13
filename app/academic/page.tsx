'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Coursework {
  id: number;
  subject: string;
  type: string;
  title: string;
  description?: string;
  pdf_url: string;
}

export default function AcademicVaultPage() {
  const [coursework, setCoursework] = useState<Coursework[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [activeTab, setActiveTab] = useState<'All' | 'Assignment' | 'Quiz'>('All');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase
        .from('coursework')
        .select('*')
        .order('id', { ascending: false });

      if (data) setCoursework(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const subjects = ['All', ...Array.from(new Set(coursework.map((c) => c.subject)))];

  const filtered = coursework.filter((c) => {
    const matchSubject = selectedSubject === 'All' || c.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchType = activeTab === 'All' || c.type.toLowerCase() === activeTab.toLowerCase();
    return matchSubject && matchType;
  });

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#059669] text-white font-mono text-xs px-2.5 py-1 rounded font-bold">
              &lt;/&gt;
            </span>
            <span className="font-bold text-lg text-slate-800 tracking-tight">
              Mohib SecDev
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              My Learning
            </Link>
            <Link href="/academic" className="text-[#059669] font-semibold">
              Academic Vault
            </Link>
            <Link href="/projects" className="hover:text-slate-900 transition-colors">
              Live Projects
            </Link>
            <Link href="/portfolio" className="hover:text-slate-900 transition-colors">
              About Me
            </Link>
            <Link
              href="/admin"
              className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Creator Studio ↗
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm font-medium text-slate-700 shadow-lg">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-50">
              My Learning
            </Link>
            <Link href="/academic" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg bg-emerald-50 text-[#059669] font-semibold">
              Academic Vault
            </Link>
            <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-50">
              Live Projects
            </Link>
            <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-50">
              About Me &amp; Journey
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold">
                Creator Studio ↗
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="max-w-2xl mb-8">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#059669] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            University Coursework Hub
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Academic Vault
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Verified university assignments, quizzes, and solved solution PDFs organized by subject. Direct download links ready for peer sharing.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition whitespace-nowrap ${
                  selectedSubject === sub
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            {(['All', 'Assignment', 'Quiz'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                  activeTab === t ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'All' ? 'All Files' : t + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 font-mono">
            Fetching academic documents...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            No coursework uploaded for this filter. Upload from Creator Studio.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.subject}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.type === 'Assignment'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed line-clamp-2">
                    {item.description || 'Full solution and report attached.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={item.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <span>👁️</span> Preview
                  </a>
                  <a
                    href={item.pdf_url}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#059669] hover:bg-[#047857] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                  >
                    <span>⬇️</span> Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}