'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  live_url: string;
  github_url: string;
  cover_image_url?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }
    loadProjects();
  }, []);

  // Sirf wahi categories nikalo jo actual projects mein exist karti hain
  const existingCategories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean))
  );

  const filteredProjects = projects.filter(
    (p) => activeFilter === 'All' || p.category?.toLowerCase() === activeFilter.toLowerCase()
  );

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

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              My Learning
            </Link>
            <Link href="/academic" className="hover:text-slate-900 transition-colors">
              Academic Vault
            </Link>
            <Link href="/projects" className="text-[#059669] font-semibold">
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
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation"
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
            <Link href="/academic" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-50">
              Academic Vault
            </Link>
            <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg bg-emerald-50 text-[#059669] font-semibold">
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
        <div className="max-w-2xl mb-10">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#059669] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Engineering Deployments
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Live Projects &amp; Software Labs
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
            Production builds, cloud security systems, and responsive web applications deployed live on Vercel.
          </p>
        </div>

        {/* Dynamic Category Filters - Only shown if more than 1 category actually exists */}
        {existingCategories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
            <button
              onClick={() => setActiveFilter('All')}
              className={`text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                activeFilter === 'All'
                  ? 'bg-[#059669] text-white shadow-sm'
                  : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              All Projects ({projects.length})
            </button>
            {existingCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
                  activeFilter === cat
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 font-mono">
            Loading live deployments...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            No projects published yet. Add your first deployment from Creator Studio.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div>
                  {proj.cover_image_url ? (
                    <img
                      src={proj.cover_image_url}
                      alt={proj.title}
                      className="w-full h-48 object-cover border-b border-slate-100"
                    />
                  ) : (
                    <div className="w-full h-36 bg-[#0f1f18] text-emerald-400 flex items-center justify-center font-mono text-sm font-bold border-b border-slate-800">
                      &lt;live_deployment /&gt;
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {proj.category || 'Web Application'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {proj.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {proj.tags &&
                        proj.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    {proj.github_url ? (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                      >
                        Source Code ↗
                      </a>
                    ) : (
                      <span className="text-slate-400">Proprietary</span>
                    )}

                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#059669] hover:bg-[#047857] text-white px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1 shadow-sm transition"
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}