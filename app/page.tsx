'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Topic {
  id: number;
  title: string;
  category: string;
  short_code: string;
  description: string;
  level?: string;
  cover_image_url?: string;
  pdf_url?: string;
  video_url?: string;
  lessons_count: number;
}

const pastelPalettes = [
  { bg: 'bg-[#eaf5ee]', text: 'text-[#1d5c38]', sub: 'text-[#2e7d4d]' },
  { bg: 'bg-[#fbebee]', text: 'text-[#7a2e38]', sub: 'text-[#9c3d4b]' },
  { bg: 'bg-[#fef8e2]', text: 'text-[#745e12]', sub: 'text-[#8f751a]' },
  { bg: 'bg-[#eef4fb]', text: 'text-[#25507b]', sub: 'text-[#32699e]' },
  { bg: 'bg-[#f7edf9]', text: 'text-[#683072]', sub: 'text-[#843e91]' },
];

export default function PublicHub() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function trackVisitor() {
      try {
        let visitorId = localStorage.getItem('vault_visitor_token');
        if (!visitorId) {
          visitorId = 'vis_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
          localStorage.setItem('vault_visitor_token', visitorId);
          await supabase.from('site_visits').insert([{ visitor_id: visitorId }]);
        }
      } catch (err) {
        console.error('Visitor tracking error:', err);
      }
    }
    trackVisitor();
  }, []);

  const fetchTopics = async () => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) setTopics(data);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((t) => {
    const matchesCategory =
      activeCategory === 'All' || t.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      {/* Top Navbar */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="text-[#059669] font-semibold">
              My Learning
            </Link>
            <Link href="/academic" className="hover:text-slate-900 transition-colors">
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

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 text-sm font-medium text-slate-700 shadow-lg">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg bg-emerald-50 text-[#059669] font-semibold"
            >
              My Learning
            </Link>
            <Link
              href="/academic"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Academic Vault (Assignments &amp; Quizzes)
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Live Projects
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              About Me &amp; Journey
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold"
              >
                Creator Studio ↗
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-slate-400">
              KNOWLEDGE BASE &amp; TECH VAULT
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              My Learning
            </h1>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to learn?"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#059669] bg-white shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {['All courses', 'Programming', 'Cybersecurity', 'Tools & Systems', 'Web Development'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === 'All courses' ? 'All' : cat)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                (activeCategory === 'All' && cat === 'All courses') || activeCategory === cat
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Harry's Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => {
              const palette = pastelPalettes[index % pastelPalettes.length];

              return (
                <Link
                  key={topic.id}
                  href={`/course/${topic.id}`}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {topic.cover_image_url ? (
                      <div className="w-full h-44 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                        <img
                          src={topic.cover_image_url}
                          alt={topic.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-full h-44 ${palette.bg} p-4 flex flex-col justify-between relative border-b border-black/[0.04] transition-colors`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-slate-500/80">
                          <span>MOHIB SECDEV</span>
                          <span className="font-mono text-xs">&lt;/&gt;</span>
                        </div>

                        <div className={`text-center font-extrabold text-5xl tracking-tight font-sans ${palette.text}`}>
                          {topic.short_code}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold ${palette.sub}`}>
                            {topic.category}
                          </span>
                          <span className="w-5 h-5 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-[9px] text-slate-700 shadow-sm group-hover:bg-white group-hover:scale-110 transition">
                            ▶
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5 pb-3">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {topic.level || 'Beginner'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-[#059669] tracking-wider">
                          FREE COURSE
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base group-hover:text-[#059669] transition-colors line-clamp-1">
                        {topic.title}
                      </h3>

                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                        {topic.description || 'Explore modules, lessons, and research materials.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">
                         {topic.lessons_count || 1} lessons
                      </span>
                      <span className="text-[#059669] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Start learning ↗
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 text-sm">
              No courses found in vault. Create one from Creator Studio.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}