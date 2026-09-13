'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface ProfileData {
  full_name: string;
  headline: string;
  bio: string;
  quick_tags: string;
  dev_title: string;
  dev_desc: string;
  dev_tags: string;
  sec_title: string;
  sec_desc: string;
  sec_tags: string;
  github_url: string;
  linkedin_url: string;
  resume_url?: string;
}

interface LabProof {
  id: number;
  platform: string;
  category: string;
  room_title: string;
  status_badge: string;
  image_url: string;
}

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issue_date: string;
  file_url?: string;
  image_url?: string;
  pdf_url?: string;
  verification_url?: string;
  category: string;
}

interface JourneyLog {
  id: number;
  title: string;
  category: string;
  image_url: string;
  caption: string;
  event_date: string;
}

export default function PortfolioPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [labProofs, setLabProofs] = useState<LabProof[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [journeyLogs, setJourneyLogs] = useState<JourneyLog[]>([]);
  const [activePlatformFilter, setActivePlatformFilter] = useState('All');
  const [activeCertCategory, setActiveCertCategory] = useState('All');
  
  // Folder / Multi-Proof Modal State
  const [activeFolderProofs, setActiveFolderProofs] = useState<{ category: string; platform: string; items: LabProof[] } | null>(null);
  const [singlePreviewImage, setSinglePreviewImage] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: profData } = await supabase.from('profile').select('*').eq('id', 1).single();
      const { data: proofsData } = await supabase.from('lab_proofs').select('*').order('id', { ascending: false });
      const { data: certsData } = await supabase.from('certificates').select('*').order('id', { ascending: false });
      const { data: logsData } = await supabase.from('journey_logs').select('*').order('id', { ascending: false });

      if (profData) setProfile(profData);
      if (proofsData) setLabProofs(proofsData);
      if (certsData) setCertificates(certsData);
      if (logsData) setJourneyLogs(logsData);
    }
    loadData();
  }, []);

  const platforms = ['All', ...Array.from(new Set(labProofs.map((p) => p.platform).filter(Boolean)))];
  const certCategories = ['All', ...Array.from(new Set(certificates.map((c) => c.category).filter(Boolean)))];

  const filteredProofs = labProofs.filter(
    (p) => activePlatformFilter === 'All' || p.platform.toLowerCase() === activePlatformFilter.toLowerCase()
  );

  const filteredCerts = certificates.filter(
    (c) => activeCertCategory === 'All' || c.category.toLowerCase() === activeCertCategory.toLowerCase()
  );

  // Group proofs by category / folder so that one card represents the folder
  const groupedFolders = filteredProofs.reduce((acc: { [key: string]: LabProof[] }, proof) => {
    const key = `${proof.platform}__${proof.category}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(proof);
    return acc;
  }, {});

  const quickTagsList = profile?.quick_tags ? profile.quick_tags.split('|').map((t) => t.trim()) : [];
  const devTagsList = profile?.dev_tags ? profile.dev_tags.split(',').map((t) => t.trim()) : [];
  const secTagsList = profile?.sec_tags ? profile.sec_tags.split(',').map((t) => t.trim()) : [];

  return (
    <main className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-24 antialiased">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-[#059669] text-white font-mono text-xs px-2.5 py-1 rounded-md font-bold">
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
            <Link href="/projects" className="hover:text-slate-900 transition-colors">
              Live Projects
            </Link>
            <Link href="/portfolio" className="text-[#059669] font-bold">
              About Me
            </Link>
            <Link
              href="/admin"
              className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
            >
              Creator Studio ↗
            </Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:text-slate-900">
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
            <Link href="/projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-slate-50">
              Live Projects
            </Link>
            <Link href="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg bg-emerald-50 text-[#059669] font-semibold">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14">
        {/* 1. Dynamic Identity Header */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="w-24 h-24 rounded-2xl bg-[#0a1813] text-emerald-400 font-mono font-bold text-3xl flex items-center justify-center border-2 border-emerald-500/30 flex-shrink-0 shadow-lg">
            &lt;M/&gt;
          </div>

          <div className="space-y-4 flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {profile?.headline || 'Undergraduate CS Student & Security Researcher'}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {profile?.full_name || 'Syed Mohib Ali Shah'}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl whitespace-pre-line">
              {profile?.bio || 'Building robust systems and exploring defensive cybersecurity operations.'}
            </p>

            {quickTagsList.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2 text-xs font-mono">
                {quickTagsList.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200 shadow-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-3 flex flex-wrap justify-center sm:justify-start gap-3">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl font-semibold border border-slate-200 transition">
                  GitHub Profile ↗
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl font-semibold border border-slate-200 transition">
                  LinkedIn ↗
                </a>
              )}
              {profile?.resume_url && (
                <a href={profile.resume_url} target="_blank" rel="noreferrer" className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5">
                  <span>📄</span> Download Resume
                </a>
              )}
            </div>
          </div>
        </section>

        {/* 2. Dual Focus Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 hover:border-emerald-400 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg border border-emerald-100">
                ⚡
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {profile?.dev_title || 'Development & Core Systems'}
                </h3>
                <span className="text-[11px] font-serif italic text-emerald-700 font-medium">Engineering foundations &amp; algorithms</span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {profile?.dev_desc}
            </p>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Core Competencies</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {devTagsList.map((tag, i) => (
                  <span key={i} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 hover:border-emerald-400 transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg border border-emerald-100">
                🛡️
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {profile?.sec_title || 'Security Research & Practical Labs'}
                </h3>
                <span className="text-[11px] font-serif italic text-emerald-700 font-medium">Offensive &amp; defensive verification</span>
              </div>
            </div>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {profile?.sec_desc}
            </p>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Tooling &amp; Practice</span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {secTagsList.map((tag, i) => (
                  <span key={i} className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. VISUAL VERIFIED CREDENTIALS */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">PROOFS</span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Verified Certifications &amp; Engineering Credentials
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Visual proofs across <span className="font-serif italic text-emerald-700 font-semibold">AI/ML, Cybersecurity, and Full-Stack Engineering</span>.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
              {certificates.length} Verified Credentials
            </span>
          </div>

          {certCategories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {certCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCertCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeCertCategory === cat
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  📜 {cat} ({cat === 'All' ? certificates.length : certificates.filter((c) => c.category === cat).length})
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredCerts.map((cert) => {
              const displayImage = cert.image_url || cert.file_url;
              const pdfLink = cert.pdf_url || (cert.file_url?.endsWith('.pdf') ? cert.file_url : null);

              return (
                <div
                  key={cert.id}
                  className="border border-slate-200 rounded-2xl overflow-hidden group hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between bg-white"
                >
                  <div
                    onClick={() => {
                      if (displayImage) {
                        setSinglePreviewImage({ url: displayImage, title: cert.title, subtitle: `${cert.issuer} • ${cert.issue_date}` });
                      }
                    }}
                    className="h-52 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-pointer border-b border-slate-100 p-2"
                  >
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={cert.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="text-emerald-400 font-mono text-xs text-center p-4">
                        📄 [PDF Certificate Attached]
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-slate-950/80 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                      {cert.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                      Verified Proof
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{cert.issue_date}</div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition line-clamp-1 mt-0.5">
                        {cert.title}
                      </h4>
                      <p className="text-slate-500 text-xs mt-1">Issued by: <span className="font-semibold text-slate-700">{cert.issuer}</span></p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                      {displayImage && (
                        <button
                          onClick={() => {
                            setSinglePreviewImage({ url: displayImage, title: cert.title, subtitle: `${cert.issuer} • ${cert.issue_date}` });
                          }}
                          className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                        >
                          <span>👁️</span> Full Screen
                        </button>
                      )}
                      <div className="flex items-center gap-2 ml-auto">
                        {cert.verification_url && (
                          <a href={cert.verification_url} target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold hover:underline flex items-center gap-1">
                            Verify URL ↗
                          </a>
                        )}
                        {pdfLink && (
                          <a href={pdfLink} target="_blank" rel="noreferrer" className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-semibold hover:bg-emerald-100 transition">
                            Official PDF 📄
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. PRACTICAL LABS (TRYHACKME / HTB) WITH FOLDER CLICK -> SCROLLABLE ALL PROOFS */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">LABS</span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Practical Cyber Defense &amp; Exploitation Vault
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Click any folder to view <span className="font-serif italic text-emerald-700 font-semibold">all lab completion proofs &amp; terminal outputs</span>.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
              {labProofs.length} Verified Screenshots
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setActivePlatformFilter(platform)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activePlatformFilter === platform
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                📁 {platform} ({platform === 'All' ? labProofs.length : labProofs.filter((p) => p.platform === platform).length})
              </button>
            ))}
          </div>

          {Object.keys(groupedFolders).length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No lab screenshots added yet. Upload from Creator Studio.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              {Object.entries(groupedFolders).map(([key, proofs]) => {
                const [platform, category] = key.split('__');
                const coverImage = proofs[0]?.image_url;

                return (
                  <div
                    key={key}
                    onClick={() => setActiveFolderProofs({ category, platform, items: proofs })}
                    className="border border-slate-200 rounded-2xl overflow-hidden group hover:border-emerald-500 hover:shadow-lg transition cursor-pointer flex flex-col justify-between bg-white"
                  >
                    <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={coverImage}
                        alt=""
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 right-2 bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        📁 {proofs.length} Proofs Inside
                      </span>
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold backdrop-blur">
                        {platform}
                      </span>
                    </div>

                    <div className="p-4 bg-white">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                        {category}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span>Click to open all {proofs.length} images</span>
                        <span className="text-emerald-600 font-semibold">Open Folder ↗</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. Journey Logs, Offer Letters & Invites */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white font-mono text-xs px-2 py-0.5 rounded font-bold">LOGS</span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Journey, Offer Letters &amp; Field Milestones
                </h2>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Official offer letters, speaker/guest passes, and live summit captures.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 self-start sm:self-auto">
              {journeyLogs.length} Milestone Records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {journeyLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => {
                  setSinglePreviewImage({ url: log.image_url, title: log.title, subtitle: `${log.category} • ${log.event_date}` });
                }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between"
              >
                <div className="w-full h-52 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                  <img src={log.image_url} alt="" className="max-h-full max-w-full object-contain hover:scale-105 transition duration-300" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase bg-slate-950/80 text-white px-2.5 py-1 rounded backdrop-blur">
                    {log.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="font-mono">{log.event_date || 'Milestone Record'}</span>
                    <span className="text-emerald-700 font-semibold">View Full Proof 👁️</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">{log.title}</h4>
                  <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{log.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FULL SCROLLABLE FOLDER MODAL (ALL 7+ IMAGES SCROLLABLE VERTICALLY) */}
      {activeFolderProofs && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-6"
          onClick={() => setActiveFolderProofs(null)}
        >
          <div
            className="bg-slate-950 border border-slate-800 rounded-3xl max-w-4xl w-full text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex-shrink-0">
              <div>
                <span className="text-emerald-400 font-mono text-xs uppercase font-bold tracking-wider">
                  {activeFolderProofs.platform} • {activeFolderProofs.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold mt-0.5">
                  Lab Proofs Gallery ({activeFolderProofs.items.length} screenshots)
                </h3>
              </div>
              <button
                onClick={() => setActiveFolderProofs(null)}
                className="text-slate-400 hover:text-white text-2xl font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* SCROLLABLE FEED CONTAINER: Har picture ek ke baad ek scroll hogi */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-8 divide-y divide-slate-800">
              {activeFolderProofs.items.map((proof, idx) => (
                <div key={proof.id} className="pt-6 first:pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded">
                      Screenshot #{idx + 1}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {proof.status_badge || '100% Solved'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-200">
                    {proof.room_title}
                  </h4>

                  {/* Clean uncropped image container */}
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-black p-2 flex items-center justify-center">
                    <img
                      src={proof.image_url}
                      alt={proof.room_title}
                      className="max-h-[80vh] w-auto h-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SINGLE IMAGE PREVIEW MODAL (FOR CERTS & OFFERS) */}
      {singlePreviewImage && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSinglePreviewImage(null)}
        >
          <div
            className="bg-slate-950 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 text-white space-y-4 shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-emerald-400 font-mono text-xs uppercase font-bold">{singlePreviewImage.subtitle}</span>
                <h3 className="text-base sm:text-lg font-bold mt-0.5">{singlePreviewImage.title}</h3>
              </div>
              <button onClick={() => setSinglePreviewImage(null)} className="text-slate-400 hover:text-white text-2xl font-bold">✕</button>
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <img src={singlePreviewImage.url} alt="" className="max-h-[72vh] max-w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}