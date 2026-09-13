'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation Tabs - Added 'users' tab
  const [currentTab, setCurrentTab] = useState<'overview' | 'users' | 'courses' | 'labs' | 'academic' | 'projects' | 'portfolio_media' | 'profile' | 'security'>('overview');
  
  // Data Records
  const [topics, setTopics] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [coursework, setCoursework] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [journeyLogs, setJourneyLogs] = useState<any[]>([]);
  const [labProofs, setLabProofs] = useState<any[]>([]);
  const [siteVisitsCount, setSiteVisitsCount] = useState<number>(0);

  // Users Activity & Visibility Controls State
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [visibilitySettings, setVisibilitySettings] = useState({
    show_labs: true,
    show_certificates: true,
    show_academic: true,
    show_projects: true
  });
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  // Selected Course for Markdown Sub-Modules / Curriculum Studio
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<any>(null);
  const [courseModules, setCourseModules] = useState<any[]>([]);
  const [activeSelectedLesson, setActiveSelectedLesson] = useState<any>(null);
  const [editorPreviewMode, setEditorPreviewMode] = useState<'write' | 'preview'>('write');

  // Modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isCourseworkModalOpen, setIsCourseworkModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Edit Tracking IDs
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editingLabId, setEditingLabId] = useState<number | null>(null);
  const [editingCourseworkId, setEditingCourseworkId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingCertId, setEditingCertId] = useState<number | null>(null);
  const [editingJourneyId, setEditingJourneyId] = useState<number | null>(null);

  // Course Inputs
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCategory, setCourseCategory] = useState('Programming');
  const [courseShortCode, setCourseShortCode] = useState('');
  const [courseCoverFile, setCourseCoverFile] = useState<File | null>(null);
  const [existingCourseCoverUrl, setExistingCourseCoverUrl] = useState<string | null>(null);
  const [coursePdfFile, setCoursePdfFile] = useState<File | null>(null);
  const [existingCoursePdfUrl, setExistingCoursePdfUrl] = useState<string | null>(null);

  // In-Workspace Markdown Lesson Inputs
  const [lessonTitleInput, setLessonTitleInput] = useState('');
  const [lessonMarkdownContent, setLessonMarkdownContent] = useState('');
  const [lessonPdfFile, setLessonPdfFile] = useState<File | null>(null);
  const [existingLessonPdfUrl, setExistingLessonPdfUrl] = useState<string | null>(null);
  const [isSavingLesson, setIsSavingLesson] = useState(false);

  // Lab Proofs Inputs
  const [labPlatform, setLabPlatform] = useState('TryHackMe');
  const [labCategory, setLabCategory] = useState('Network Recon');
  const [labTitle, setLabTitle] = useState('');
  const [labBadge, setLabBadge] = useState('100% Solved');
  const [labFiles, setLabFiles] = useState<File[]>([]);
  const [existingLabUrl, setExistingLabUrl] = useState<string | null>(null);

  // Academic Coursework Inputs
  const [cwSubject, setCwSubject] = useState('');
  const [cwType, setCwType] = useState('Assignment');
  const [cwTitle, setCwTitle] = useState('');
  const [cwDesc, setCwDesc] = useState('');
  const [cwFile, setCwFile] = useState<File | null>(null);
  const [existingCwPdfUrl, setExistingCwPdfUrl] = useState<string | null>(null);

  // Project Inputs
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Web Application');
  const [projDesc, setProjDesc] = useState('');
  const [projTags, setProjTags] = useState('');
  const [projLiveUrl, setProjLiveUrl] = useState('');
  const [projGithubUrl, setProjGithubUrl] = useState('');

  // Certificate Inputs
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certCategory, setCertCategory] = useState('AI & Machine Learning');
  const [certDate, setCertDate] = useState('');
  const [certVerificationUrl, setCertVerificationUrl] = useState('');
  const [certImageFile, setCertImageFile] = useState<File | null>(null);
  const [existingCertImageUrl, setExistingCertImageUrl] = useState<string | null>(null);
  const [certPdfFile, setCertPdfFile] = useState<File | null>(null);
  const [existingCertPdfUrl, setExistingCertPdfUrl] = useState<string | null>(null);

  // Journey Inputs
  const [journeyTitle, setJourneyTitle] = useState('');
  const [journeyCategory, setJourneyCategory] = useState('Offer Letter');
  const [journeyDate, setJourneyDate] = useState('');
  const [journeyCaption, setJourneyCaption] = useState('');
  const [journeyFile, setJourneyFile] = useState<File | null>(null);
  const [existingJourneyUrl, setExistingJourneyUrl] = useState<string | null>(null);

  // Profile CMS Inputs
  const [profName, setProfName] = useState('');
  const [profHeadline, setProfHeadline] = useState('');
  const [profBio, setProfBio] = useState('');
  const [profQuickTags, setProfQuickTags] = useState('');
  const [profDevTitle, setProfDevTitle] = useState('');
  const [profDevDesc, setProfDevDesc] = useState('');
  const [profDevTags, setProfDevTags] = useState('');
  const [profSecTitle, setProfSecTitle] = useState('');
  const [profSecDesc, setProfSecDesc] = useState('');
  const [profSecTags, setProfSecTags] = useState('');
  const [profGithub, setProfGithub] = useState('');
  const [profLinkedin, setProfLinkedin] = useState('');
  const [profResumeFile, setProfResumeFile] = useState<File | null>(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Management
  const [oldPasswordChange, setOldPasswordChange] = useState('');
  const [newPasswordChange, setNewPasswordChange] = useState('');
  const [confirmPasswordChange, setConfirmPasswordChange] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const loadAllData = async () => {
    try {
      const { data: topicsData } = await supabase.from('topics').select('*').order('id', { ascending: false });
      const { data: modulesData } = await supabase.from('modules').select('*').order('id', { ascending: false });
      const { data: cwData } = await supabase.from('coursework').select('*').order('id', { ascending: false });
      const { data: projData } = await supabase.from('projects').select('*').order('id', { ascending: false });
      const { data: certData } = await supabase.from('certificates').select('*').order('id', { ascending: false });
      const { data: journeyData } = await supabase.from('journey_logs').select('*').order('id', { ascending: false });
      const { data: proofs } = await supabase.from('lab_proofs').select('*').order('id', { ascending: false });
      const { count: visitsCount } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
      const { data: profData } = await supabase.from('profile').select('*').eq('id', 1).single();

      // Users activity logs & Visibility settings
      const { data: logsData } = await supabase.from('user_activity_logs').select('*').order('id', { ascending: false }).limit(50);
      const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();

      if (topicsData) setTopics(topicsData);
      if (modulesData) setModules(modulesData);
      if (cwData) setCoursework(cwData);
      if (projData) setProjects(projData);
      if (certData) setCertificates(certData);
      if (journeyData) setJourneyLogs(journeyData);
      if (proofs) setLabProofs(proofs);
      if (visitsCount !== null) setSiteVisitsCount(visitsCount);
      if (logsData) setUserLogs(logsData);
      if (settingsData) {
        setVisibilitySettings({
          show_labs: settingsData.show_labs ?? true,
          show_certificates: settingsData.show_certificates ?? true,
          show_academic: settingsData.show_academic ?? true,
          show_projects: settingsData.show_projects ?? true,
        });
      }

      if (profData) {
        setProfName(profData.full_name || '');
        setProfHeadline(profData.headline || '');
        setProfBio(profData.bio || '');
        setProfQuickTags(profData.quick_tags || '📍 Haripur, PK | 🎯 Active Learner | 💻 Systems & Security');
        setProfDevTitle(profData.dev_title || 'Development & Core Systems');
        setProfDevDesc(profData.dev_desc || '');
        setProfDevTags(profData.dev_tags || '');
        setProfSecTitle(profData.sec_title || 'Security Research & Practical Labs');
        setProfSecDesc(profData.sec_desc || '');
        setProfSecTags(profData.sec_tags || '');
        setProfGithub(profData.github_url || '');
        setProfLinkedin(profData.linkedin_url || '');
        setExistingResumeUrl(profData.resume_url || null);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
    }
  };

  const fetchModulesForCourse = async (courseId: number) => {
    const { data } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (data) {
      setCourseModules(data);
      if (data.length > 0) {
        selectLessonForEditing(data[0]);
      } else {
        createNewSubModuleBlank();
      }
    }
  };

  const selectLessonForEditing = (lesson: any) => {
    setActiveSelectedLesson(lesson);
    setLessonTitleInput(lesson.title || '');
    setLessonMarkdownContent(lesson.content || '');
    setExistingLessonPdfUrl(lesson.pdf_url || null);
    setLessonPdfFile(null);
  };

  const createNewSubModuleBlank = () => {
    setActiveSelectedLesson(null);
    setLessonTitleInput('');
    setLessonMarkdownContent('# 01. Topic Heading\n\nExplain technical concepts, architecture, or code here.\n\n```python\n# Write code snippets directly\nprint("Hello Mohib SecDev")\n```');
    setExistingLessonPdfUrl(null);
    setLessonPdfFile(null);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // LOGIN: Direct Database Verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const { data: authRecord, error } = await supabase
        .from('admin_auth')
        .select('*')
        .eq('id', 1)
        .single();

      if (error || !authRecord) {
        if (usernameInput === 'admin' && passwordInput === 'admin123') {
          setIsAuthenticated(true);
        } else {
          alert('Access Denied: Invalid credentials.');
        }
      } else {
        if (usernameInput === authRecord.username && passwordInput === authRecord.password) {
          setIsAuthenticated(true);
        } else {
          alert('Access Denied: Invalid username or password.');
        }
      }
    } catch (err: any) {
      alert('Login error: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Ultra-Fast Client-Side Compression
  const compressImage = async (file: File): Promise<Blob> => {
    if (file.type === 'application/pdf') return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/webp',
            0.82
          );
        };
      };
    });
  };

  // High-Speed Vault Upload
  const uploadToVault = async (file: File, folder: string) => {
    const compressedBlob = await compressImage(file);
    const fileExt = file.type === 'application/pdf' ? 'pdf' : 'webp';
    const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error } = await supabase.storage.from('vault-files').upload(filePath, compressedBlob, {
      contentType: file.type === 'application/pdf' ? 'application/pdf' : 'image/webp',
      cacheControl: '3600',
      upsert: false
    });
    
    if (error) throw error;
    const { data } = supabase.storage.from('vault-files').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Save Visibility Settings (Toggle On/Off)
  const handleToggleVisibility = async (key: keyof typeof visibilitySettings) => {
    const updated = { ...visibilitySettings, [key]: !visibilitySettings[key] };
    setVisibilitySettings(updated);
    setIsUpdatingSettings(true);

    try {
      const { error } = await supabase.from('site_settings').upsert({
        id: 1,
        ...updated,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    } catch (err: any) {
      alert('Failed to update visibility: ' + err.message);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  // Direct In-Studio Markdown Lesson Save
  const handleSaveLessonDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForModules) return;
    if (!lessonTitleInput) return alert('Lesson / Sub-module title is required.');

    setIsSavingLesson(true);
    try {
      let pdf = existingLessonPdfUrl;
      if (lessonPdfFile) pdf = await uploadToVault(lessonPdfFile, 'documents');

      if (activeSelectedLesson && activeSelectedLesson.id) {
        const { error } = await supabase.from('modules').update({
          title: lessonTitleInput,
          content: lessonMarkdownContent,
          pdf_url: pdf
        }).eq('id', activeSelectedLesson.id);

        if (error) throw error;
        alert('Lesson markdown updated successfully!');
      } else {
        const { data, error } = await supabase.from('modules').insert([{
          course_id: selectedCourseForModules.id,
          title: lessonTitleInput,
          content: lessonMarkdownContent,
          pdf_url: pdf,
          order_index: courseModules.length + 1
        }]).select().single();

        if (error) throw error;
        alert('New sub-module published to curriculum!');
        if (data) setActiveSelectedLesson(data);
      }

      fetchModulesForCourse(selectedCourseForModules.id);
      loadAllData();
    } catch (err: any) {
      alert('Save lesson error: ' + err.message);
    } finally {
      setIsSavingLesson(false);
    }
  };

  // Course Track Save
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || !courseShortCode) return alert('Title and Symbol code are required.');
    setIsUploading(true);
    try {
      let cover = existingCourseCoverUrl;
      let pdf = existingCoursePdfUrl;
      if (courseCoverFile) cover = await uploadToVault(courseCoverFile, 'covers');
      if (coursePdfFile) pdf = await uploadToVault(coursePdfFile, 'documents');

      if (editingCourseId) {
        await supabase.from('topics').update({
          title: courseTitle,
          description: courseDesc,
          category: courseCategory,
          short_code: courseShortCode,
          cover_image_url: cover,
          pdf_url: pdf,
        }).eq('id', editingCourseId);
      } else {
        await supabase.from('topics').insert([{
          title: courseTitle,
          description: courseDesc,
          category: courseCategory,
          short_code: courseShortCode,
          cover_image_url: cover || null,
          pdf_url: pdf || null,
          lessons_count: 0
        }]);
      }
      setIsCourseModalOpen(false);
      loadAllData();
    } catch (err: any) {
      alert('Course save error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Lab Proof Batch Upload
  const handleSaveLabProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabId && labFiles.length === 0) {
      alert('Please select at least one screenshot or multiple images!');
      return;
    }

    setIsUploading(true);
    setUploadProgressText(`Compressing & Uploading ${labFiles.length || 1} image(s)...`);

    try {
      if (editingLabId) {
        let finalUrl = existingLabUrl;
        if (labFiles.length > 0) finalUrl = await uploadToVault(labFiles[0], 'lab_proofs');
        
        await supabase.from('lab_proofs').update({
          platform: labPlatform,
          category: labCategory,
          room_title: labTitle,
          status_badge: labBadge,
          image_url: finalUrl
        }).eq('id', editingLabId);
      } else {
        const uploadPromises = labFiles.map(async (file) => {
          const uploadedUrl = await uploadToVault(file, 'lab_proofs');
          const cleanFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const itemTitle = labTitle.trim() 
            ? (labFiles.length > 1 ? `${labTitle} - ${cleanFileName}` : labTitle) 
            : cleanFileName;

          return {
            platform: labPlatform,
            category: labCategory,
            room_title: itemTitle,
            status_badge: labBadge,
            image_url: uploadedUrl
          };
        });

        const rowsToInsert = await Promise.all(uploadPromises);
        const { error } = await supabase.from('lab_proofs').insert(rowsToInsert);
        if (error) throw error;
      }

      setIsLabModalOpen(false);
      setLabTitle('');
      setLabFiles([]);
      setEditingLabId(null);
      alert(`Success! ${labFiles.length || 1} screenshots uploaded in seconds!`);
      loadAllData();
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  // Academic Coursework Save
  const handleSaveCoursework = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let pdfUrl = existingCwPdfUrl;
      if (cwFile) pdfUrl = await uploadToVault(cwFile, 'coursework');
      if (!pdfUrl) {
        alert('Please attach a PDF document.');
        setIsUploading(false);
        return;
      }

      if (editingCourseworkId) {
        await supabase.from('coursework').update({
          subject: cwSubject, type: cwType, title: cwTitle, description: cwDesc || null, pdf_url: pdfUrl
        }).eq('id', editingCourseworkId);
      } else {
        await supabase.from('coursework').insert([{
          subject: cwSubject, type: cwType, title: cwTitle, description: cwDesc || null, pdf_url: pdfUrl
        }]);
      }
      setIsCourseworkModalOpen(false);
      setCwSubject(''); setCwTitle(''); setCwDesc(''); setCwFile(null); setEditingCourseworkId(null);
      loadAllData();
    } catch (err: any) {
      alert('Coursework error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Live Project Save
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = projTags.split(',').map((t) => t.trim()).filter(Boolean);
    if (editingProjectId) {
      await supabase.from('projects').update({
        title: projTitle, category: projCategory, description: projDesc,
        tags: tagsArray, live_url: projLiveUrl || null, github_url: projGithubUrl || null
      }).eq('id', editingProjectId);
    } else {
      await supabase.from('projects').insert([{
        title: projTitle, category: projCategory, description: projDesc,
        tags: tagsArray, live_url: projLiveUrl || null, github_url: projGithubUrl || null
      }]);
    }
    setIsProjectModalOpen(false);
    setProjTitle(''); setProjDesc(''); setProjTags(''); setProjLiveUrl(''); setProjGithubUrl(''); setEditingProjectId(null);
    loadAllData();
  };

  // Certificate Save
  const handleSaveCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imgUrl = existingCertImageUrl;
      let pdfUrl = existingCertPdfUrl;
      if (certImageFile) imgUrl = await uploadToVault(certImageFile, 'certificates_img');
      if (certPdfFile) pdfUrl = await uploadToVault(certPdfFile, 'certificates_pdf');

      const fallbackUrl = imgUrl || pdfUrl || '';

      if (editingCertId) {
        await supabase.from('certificates').update({
          title: certTitle, issuer: certIssuer, category: certCategory, issue_date: certDate,
          image_url: imgUrl, pdf_url: pdfUrl, verification_url: certVerificationUrl || null, file_url: fallbackUrl
        }).eq('id', editingCertId);
      } else {
        await supabase.from('certificates').insert([{
          title: certTitle, issuer: certIssuer, category: certCategory, issue_date: certDate,
          image_url: imgUrl, pdf_url: pdfUrl, verification_url: certVerificationUrl || null, file_url: fallbackUrl
        }]);
      }
      setIsCertModalOpen(false);
      setCertTitle(''); setCertIssuer(''); setCertVerificationUrl(''); setCertImageFile(null); setCertPdfFile(null); setEditingCertId(null);
      loadAllData();
    } catch (err: any) {
      alert('Certificate save error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Journey Save
  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let imgUrl = existingJourneyUrl;
      if (journeyFile) imgUrl = await uploadToVault(journeyFile, 'journey');
      if (!imgUrl) {
        alert('Please select an image file.');
        setIsUploading(false);
        return;
      }

      if (editingJourneyId) {
        await supabase.from('journey_logs').update({
          title: journeyTitle, category: journeyCategory, event_date: journeyDate, caption: journeyCaption, image_url: imgUrl
        }).eq('id', editingJourneyId);
      } else {
        await supabase.from('journey_logs').insert([{
          title: journeyTitle, category: journeyCategory, event_date: journeyDate, caption: journeyCaption, image_url: imgUrl
        }]);
      }
      setIsJourneyModalOpen(false);
      setJourneyTitle(''); setJourneyCaption(''); setJourneyFile(null); setEditingJourneyId(null);
      loadAllData();
    } catch (err: any) {
      alert('Journey save error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Profile CMS Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      let resumeUrl = existingResumeUrl;
      if (profResumeFile) resumeUrl = await uploadToVault(profResumeFile, 'resumes');

      const { error } = await supabase.from('profile').upsert({
        id: 1,
        full_name: profName,
        headline: profHeadline,
        bio: profBio,
        quick_tags: profQuickTags,
        dev_title: profDevTitle,
        dev_desc: profDevDesc,
        dev_tags: profDevTags,
        sec_title: profSecTitle,
        sec_desc: profSecDesc,
        sec_tags: profSecTags,
        github_url: profGithub,
        linkedin_url: profLinkedin,
        resume_url: resumeUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      alert('Profile successfully saved! Live on /portfolio.');
      loadAllData();
    } catch (err: any) {
      alert('Profile update error: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // PASSWORD UPDATE: Direct Supabase Database Mutation
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordChange !== confirmPasswordChange) {
      return alert('Naya password aur confirm password aapas mein match nahi kar rahe!');
    }
    if (newPasswordChange.trim().length === 0) {
      return alert('Password blank nahi ho sakta.');
    }

    setIsUpdatingPassword(true);

    try {
      const { data: authRecord, error: fetchErr } = await supabase
        .from('admin_auth')
        .select('*')
        .eq('id', 1)
        .single();

      if (fetchErr || !authRecord) {
        throw new Error('Database auth table nahi mila. Pehle SQL editor mein table banayein.');
      }

      if (authRecord.password !== oldPasswordChange) {
        alert('Purana password galat hai!');
        setIsUpdatingPassword(false);
        return;
      }

      const { error: updateErr } = await supabase
        .from('admin_auth')
        .update({
          password: newPasswordChange,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (updateErr) throw updateErr;

      alert('SUCCESS: Password Supabase database mein hamesha ke liye update ho gaya!');
      setOldPasswordChange('');
      setNewPasswordChange('');
      setConfirmPasswordChange('');
      setCurrentTab('overview');
    } catch (err: any) {
      alert('Password update error: ' + err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const deleteRecord = async (table: string, id: number) => {
    if (!confirm('Are you sure you want to permanently delete this item?')) return;
    await supabase.from(table).delete().eq('id', id);
    loadAllData();
    if (table === 'modules' && selectedCourseForModules) {
      fetchModulesForCourse(selectedCourseForModules.id);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a1813] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-emerald-900/60 p-8 rounded-2xl max-w-sm w-full shadow-2xl space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-emerald-500 text-slate-950 font-mono font-bold text-xs px-2.5 py-1 rounded">&lt;/&gt;</span>
            <h2 className="text-white font-bold text-lg tracking-tight">Admin Studio Authentication</h2>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Username</label>
            <input type="text" required placeholder="admin" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password</label>
            <input type="password" required placeholder="••••••••" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <button type="submit" disabled={isLoggingIn} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-lg disabled:bg-slate-700">
            {isLoggingIn ? 'Verifying with Database...' : 'Authenticate Studio'}
          </button>
          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300">← Return to Main Platform</Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row antialiased">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a1813] text-slate-300 flex flex-col justify-between border-r border-[#152e24] flex-shrink-0">
        <div>
          <div className="p-6 pb-4">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <span className="bg-emerald-500 text-slate-950 text-xs px-2 py-0.5 rounded font-mono font-bold">&lt;/&gt;</span>
              <div className="leading-tight">
                <div>Mohib SecDev</div>
                <div className="text-[9px] text-emerald-500 tracking-widest font-mono font-medium">CREATOR STUDIO</div>
              </div>
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-6 mb-2">Studio Controls</div>
          </div>

          <nav className="px-3 space-y-1 text-xs font-medium">
            <button
              onClick={() => { setCurrentTab('overview'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'overview' && !selectedCourseForModules ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>⊞ Overview</span>
            </button>

            {/* USERS & VISIBILITY CONTROL TAB (NEW) */}
            <button
              onClick={() => { setCurrentTab('users'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'users' ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>👥 Users &amp; Activity</span>
              <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300 font-mono">Live</span>
            </button>

            {/* MY LEARNING TRACKS */}
            <button
              onClick={() => { setCurrentTab('courses'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'courses' || selectedCourseForModules ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>📖 My Learning Tracks</span>
              <span className="text-[10px] bg-[#1d4333] px-2 py-0.5 rounded-full text-emerald-300 font-mono">{topics.length}</span>
            </button>

            {/* LAB PROOFS */}
            <button
              onClick={() => { setCurrentTab('labs'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'labs' ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>🛡️ Lab Proofs (THM/HTB)</span>
              <span className="text-[10px] bg-[#1d4333] px-2 py-0.5 rounded-full text-emerald-300 font-mono">{labProofs.length}</span>
            </button>

            {/* ACADEMIC VAULT */}
            <button
              onClick={() => { setCurrentTab('academic'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'academic' ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>🎓 Academic Vault (PDFs)</span>
              <span className="text-[10px] bg-[#1d4333] px-2 py-0.5 rounded-full text-emerald-300 font-mono">{coursework.length}</span>
            </button>

            {/* LIVE PROJECTS */}
            <button
              onClick={() => { setCurrentTab('projects'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'projects' ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>🚀 Live Projects</span>
              <span className="text-[10px] bg-[#1d4333] px-2 py-0.5 rounded-full text-emerald-300 font-mono">{projects.length}</span>
            </button>

            {/* CERTIFICATES & OFFERS */}
            <button
              onClick={() => { setCurrentTab('portfolio_media'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'portfolio_media' ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>📜 Certificates &amp; Offers</span>
              <span className="text-[10px] bg-[#1d4333] px-2 py-0.5 rounded-full text-emerald-300 font-mono">{certificates.length + journeyLogs.length}</span>
            </button>

            {/* ABOUT ME CMS */}
            <button
              onClick={() => { setCurrentTab('profile'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'profile' ? 'bg-[#153427] text-emerald-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>👤 About Me CMS</span>
              <span className="text-[10px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300 font-mono">Dynamic</span>
            </button>

            {/* SECURITY */}
            <button
              onClick={() => { setCurrentTab('security'); setSelectedCourseForModules(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                currentTab === 'security' ? 'bg-[#153427] text-rose-400 font-semibold' : 'hover:bg-[#122820] text-slate-400'
              }`}
            >
              <span>🔒 Admin Password</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-[#152e24]">
          <Link href="/" target="_blank" className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 mb-4">
            <span>↗</span> View Public Site
          </Link>
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-white">Mohib (Admin)</div>
            <button onClick={() => setIsAuthenticated(false)} className="text-rose-400 text-xs">Sign Out</button>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <header className="h-14 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Workspace</span>
            <span>›</span>
            <span className="font-semibold text-slate-900 capitalize">
              {selectedCourseForModules ? `Curriculum: ${selectedCourseForModules.title}` : currentTab.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/" target="_blank" className="text-slate-600 hover:text-slate-900">Live Home ↗</Link>
            <Link href="/portfolio" target="_blank" className="text-emerald-700 hover:underline">Live Portfolio ↗</Link>
          </div>
        </header>

        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && !selectedCourseForModules && (
            <div className="space-y-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, Mohib.</h1>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-medium">My Learning Tracks</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{topics.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-medium">Lab Proofs (THM/HTB)</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{labProofs.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-medium">Academic Vault PDFs</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{coursework.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-slate-500 text-xs font-medium">Audience Visitors</div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{siteVisitsCount}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS & ACTIVITY (NEW) */}
          {currentTab === 'users' && !selectedCourseForModules && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">User Activity, Downloads &amp; Visibility Controls</h1>
                <p className="text-xs text-slate-500 mt-1">Track visitor interactions, PDF downloads, and toggle public sections ON or OFF.</p>
              </div>

              {/* 1. SECTION VISIBILITY CONTROLS (ON / OFF SWITCHES) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span>🎛️</span> Section Visibility Controls (Toggle ON / OFF for Public Visitors)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {/* Toggle Labs */}
                  <div className="p-4 border rounded-2xl flex items-center justify-between bg-slate-50">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Lab Proofs Vault</div>
                      <div className="text-[10px] text-slate-500">THM &amp; HTB Gallery</div>
                    </div>
                    <button
                      onClick={() => handleToggleVisibility('show_labs')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        visibilitySettings.show_labs ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {visibilitySettings.show_labs ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
                    </button>
                  </div>

                  {/* Toggle Certificates */}
                  <div className="p-4 border rounded-2xl flex items-center justify-between bg-slate-50">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Certificates &amp; Offers</div>
                      <div className="text-[10px] text-slate-500">Verified Credentials</div>
                    </div>
                    <button
                      onClick={() => handleToggleVisibility('show_certificates')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        visibilitySettings.show_certificates ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {visibilitySettings.show_certificates ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
                    </button>
                  </div>

                  {/* Toggle Academic Vault */}
                  <div className="p-4 border rounded-2xl flex items-center justify-between bg-slate-50">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Academic Vault</div>
                      <div className="text-[10px] text-slate-500">Coursework PDFs</div>
                    </div>
                    <button
                      onClick={() => handleToggleVisibility('show_academic')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        visibilitySettings.show_academic ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {visibilitySettings.show_academic ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
                    </button>
                  </div>

                  {/* Toggle Projects */}
                  <div className="p-4 border rounded-2xl flex items-center justify-between bg-slate-50">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Live Projects</div>
                      <div className="text-[10px] text-slate-500">Deployments</div>
                    </div>
                    <button
                      onClick={() => handleToggleVisibility('show_projects')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        visibilitySettings.show_projects ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                      }`}
                    >
                      {visibilitySettings.show_projects ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. VISITOR DOWNLOADS & ACTIVITY LOGS TABLE */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>📥</span> Recent Visitor Interactions &amp; Downloads ({userLogs.length} events)
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Real-time record of users downloading resumes, PDFs, or viewing labs.</p>
                  </div>
                  <button
                    onClick={loadAllData}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl font-semibold text-slate-700"
                  >
                    Refresh Logs 🔄
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Activity Type</th>
                        <th className="p-3.5">Item / Document Name</th>
                        <th className="p-3.5">Visitor Identifier</th>
                        <th className="p-3.5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {userLogs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-slate-400">
                            No visitor activity logged yet. When visitors download your resume or course PDFs, logs will appear here.
                          </td>
                        </tr>
                      ) : (
                        userLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="p-3.5 font-bold">
                              <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                                log.event_type.includes('download') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {log.event_type}
                              </span>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-900">{log.item_name}</td>
                            <td className="p-3.5 font-mono text-[11px] text-slate-500">{log.user_ip_hint || 'Anonymous Visitor'}</td>
                            <td className="p-3.5 text-right text-[11px] text-slate-400 font-mono">
                              {new Date(log.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY LEARNING COURSES */}
          {currentTab === 'courses' && !selectedCourseForModules && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">My Learning Courses &amp; Tracks</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Click on any course row to open its <b>Curriculum &amp; Markdown Notes Studio</b>, or click Edit Track to update info.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCourseId(null);
                    setCourseTitle(''); setCourseDesc(''); setCourseCategory('Programming'); setCourseShortCode('');
                    setCourseCoverFile(null); setCoursePdfFile(null); setExistingCourseCoverUrl(null); setExistingCoursePdfUrl(null);
                    setIsCourseModalOpen(true);
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  + Add Course Track
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-4">Track Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Sub-Modules</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topics.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">No courses yet. Click "+ Add Course Track" to create one.</td>
                      </tr>
                    ) : (
                      topics.map((t) => (
                        <tr
                          key={t.id}
                          className="hover:bg-slate-50 cursor-pointer"
                          onClick={() => { setSelectedCourseForModules(t); fetchModulesForCourse(t.id); }}
                        >
                          <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                            <span className="font-mono bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs">{t.short_code}</span>
                            <div>
                              <div>{t.title}</div>
                              <div className="text-[11px] text-emerald-600 font-normal mt-0.5">Click to open Markdown Notes Studio ↗</div>
                            </div>
                          </td>
                          <td className="p-4">{t.category}</td>
                          <td className="p-4 font-mono text-emerald-700 font-semibold">
                            {modules.filter((m) => m.course_id === t.id).length} sub-modules
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCourseId(t.id);
                                setCourseTitle(t.title);
                                setCourseDesc(t.description || '');
                                setCourseCategory(t.category);
                                setCourseShortCode(t.short_code);
                                setExistingCourseCoverUrl(t.cover_image_url || null);
                                setExistingCoursePdfUrl(t.pdf_url || null);
                                setCourseCoverFile(null); setCoursePdfFile(null);
                                setIsCourseModalOpen(true);
                              }}
                              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded text-xs font-semibold"
                            >
                              Edit Track ✏️
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteRecord('topics', t.id); }}
                              className="text-rose-600 hover:underline font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TWO-PANE MARKDOWN NOTES & SUB-MODULES STUDIO */}
          {selectedCourseForModules && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSelectedCourseForModules(null); setActiveSelectedLesson(null); }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg"
                  >
                    ← Back to Tracks
                  </button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedCourseForModules.title}</h2>
                    <span className="text-[11px] text-slate-400 font-mono">Curriculum &amp; Technical Notes Studio</span>
                  </div>
                </div>

                <button
                  onClick={createNewSubModuleBlank}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm self-start sm:self-auto"
                >
                  + New Sub-Module / Lesson
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center px-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sub-Modules List</span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {courseModules.length} topics
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
                    {courseModules.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No lessons created yet. Click "+ New Sub-Module" above to write your first notes.
                      </div>
                    ) : (
                      courseModules.map((m, idx) => (
                        <div
                          key={m.id}
                          onClick={() => selectLessonForEditing(m)}
                          className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                            activeSelectedLesson?.id === m.id
                              ? 'bg-emerald-50 border border-emerald-300 text-slate-900 shadow-sm'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="font-mono text-xs text-slate-400 font-bold">#{idx + 1}</span>
                            <div className="truncate">
                              <div className="font-bold text-xs truncate">{m.title}</div>
                              <div className="flex gap-2 text-[10px] text-slate-400 mt-0.5">
                                {m.content ? <span className="text-emerald-700 font-medium">Markdown ✓</span> : <span>No Text</span>}
                                {m.pdf_url && <span className="text-rose-600 font-medium">PDF 📄</span>}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); deleteRecord('modules', m.id); }}
                            className="text-slate-400 hover:text-rose-600 text-xs p-1"
                            title="Delete module"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {activeSelectedLesson ? 'Editing Sub-Module' : 'Creating New Sub-Module'}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {activeSelectedLesson ? activeSelectedLesson.title : 'New Sub-Module Notes'}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setEditorPreviewMode('write')}
                        className={`px-3 py-1.5 rounded-lg transition ${editorPreviewMode === 'write' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        ✏️ Markdown Editor
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorPreviewMode('preview')}
                        className={`px-3 py-1.5 rounded-lg transition ${editorPreviewMode === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
                      >
                        👁️ Live Preview
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveLessonDirect} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Module / Lesson Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 01. Foundations of Assembly Language"
                        value={lessonTitleInput}
                        onChange={(e) => setLessonTitleInput(e.target.value)}
                        className="w-full border rounded-xl p-2.5 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Technical Notes Content (Markdown Syntax)</span>
                        <span className="text-[10px] font-mono text-slate-400">Supports # headings, code blocks, lists</span>
                      </label>

                      {editorPreviewMode === 'write' ? (
                        <textarea
                          rows={14}
                          required
                          value={lessonMarkdownContent}
                          onChange={(e) => setLessonMarkdownContent(e.target.value)}
                          placeholder="Write technical notes here..."
                          className="w-full font-mono text-xs border rounded-xl p-4 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                        />
                      ) : (
                        <div className="w-full min-h-[300px] max-h-[500px] overflow-y-auto border rounded-xl p-5 bg-slate-50 font-sans text-xs space-y-3 leading-relaxed whitespace-pre-wrap">
                          {lessonMarkdownContent}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Attach / Replace Slides or Document PDF (Optional)
                        </label>
                        {existingLessonPdfUrl && (
                          <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5">
                            <span>Current PDF:</span>
                            <a href={existingLessonPdfUrl} target="_blank" className="text-emerald-700 underline font-semibold">View Uploaded PDF ↗</a>
                          </div>
                        )}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setLessonPdfFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full border rounded-xl p-1.5 text-xs bg-slate-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingLesson}
                        className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-xl text-xs font-semibold disabled:bg-slate-400 shadow-sm self-end"
                      >
                        {isSavingLesson ? 'Saving Lesson...' : 'Save & Publish Sub-Module'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LAB PROOFS */}
          {currentTab === 'labs' && !selectedCourseForModules && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Lab Proofs (TryHackMe, PortSwigger, HTB)</h1>
                  <p className="text-xs text-slate-500 mt-1">Upload multiple challenge screenshots or complete folder batches.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingLabId(null);
                    setLabPlatform('TryHackMe'); setLabCategory('Network Recon'); setLabTitle(''); setLabBadge('100% Solved');
                    setLabFiles([]); setExistingLabUrl(null);
                    setIsLabModalOpen(true);
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  + Upload Folder / Batch Proofs
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-4">Platform</th>
                      <th className="p-4">Category / Folder</th>
                      <th className="p-4">Room Title</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {labProofs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">No lab screenshots uploaded yet. Click "+ Upload Folder / Batch Proofs".</td>
                      </tr>
                    ) : (
                      labProofs.map((lab) => (
                        <tr key={lab.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900">{lab.platform}</td>
                          <td className="p-4">{lab.category}</td>
                          <td className="p-4 font-medium">{lab.room_title}</td>
                          <td className="p-4">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-mono text-[10px]">
                              {lab.status_badge}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingLabId(lab.id);
                                setLabPlatform(lab.platform);
                                setLabCategory(lab.category);
                                setLabTitle(lab.room_title);
                                setLabBadge(lab.status_badge || '100% Solved');
                                setExistingLabUrl(lab.image_url);
                                setLabFiles([]);
                                setIsLabModalOpen(true);
                              }}
                              className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold"
                            >
                              Edit ✏️
                            </button>
                            <button onClick={() => deleteRecord('lab_proofs', lab.id)} className="text-rose-600 hover:underline">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ACADEMIC VAULT */}
          {currentTab === 'academic' && !selectedCourseForModules && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Academic Vault (Assignments &amp; Quizzes)</h1>
                  <p className="text-xs text-slate-500 mt-1">Upload solved PDFs for your university peers.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCourseworkId(null);
                    setCwSubject(''); setCwTitle(''); setCwDesc(''); setCwFile(null); setExistingCwPdfUrl(null);
                    setIsCourseworkModalOpen(true);
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  + Upload Coursework PDF
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Title</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coursework.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">No coursework uploaded yet. Click "+ Upload Coursework PDF".</td>
                      </tr>
                    ) : (
                      coursework.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900">{c.subject}</td>
                          <td className="p-4"><span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-semibold">{c.type}</span></td>
                          <td className="p-4">{c.title}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingCourseworkId(c.id);
                                setCwSubject(c.subject);
                                setCwType(c.type);
                                setCwTitle(c.title);
                                setCwDesc(c.description || '');
                                setExistingCwPdfUrl(c.pdf_url);
                                setCwFile(null);
                                setIsCourseworkModalOpen(true);
                              }}
                              className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold"
                            >
                              Edit ✏️
                            </button>
                            <button onClick={() => deleteRecord('coursework', c.id)} className="text-rose-600 hover:underline font-semibold">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: LIVE PROJECTS */}
          {currentTab === 'projects' && !selectedCourseForModules && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Live Deployments</h1>
                  <p className="text-xs text-slate-500 mt-1">Publish live Vercel deployments and GitHub repositories.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjTitle(''); setProjCategory('Web Application'); setProjDesc(''); setProjTags('');
                    setProjLiveUrl(''); setProjGithubUrl('');
                    setIsProjectModalOpen(true);
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm"
                >
                  + Add Live Project
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-4">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Live Link</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">No live projects yet. Click "+ Add Live Project".</td>
                      </tr>
                    ) : (
                      projects.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-4 font-bold text-slate-900">{p.title}</td>
                          <td className="p-4">{p.category}</td>
                          <td className="p-4">{p.live_url ? <a href={p.live_url} target="_blank" className="text-emerald-600 underline">Vercel ↗</a> : 'N/A'}</td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProjectId(p.id);
                                setProjTitle(p.title);
                                setProjCategory(p.category || 'Web Application');
                                setProjDesc(p.description || '');
                                setProjTags(Array.isArray(p.tags) ? p.tags.join(', ') : '');
                                setProjLiveUrl(p.live_url || '');
                                setProjGithubUrl(p.github_url || '');
                                setIsProjectModalOpen(true);
                              }}
                              className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-xs font-semibold"
                            >
                              Edit ✏️
                            </button>
                            <button onClick={() => deleteRecord('projects', p.id)} className="text-rose-600 hover:underline">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CERTIFICATES & OFFERS */}
          {currentTab === 'portfolio_media' && !selectedCourseForModules && (
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Verified Certificate Proofs</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Upload certificate screenshot images, attach PDFs, and add verification URLs.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCertId(null);
                      setCertTitle(''); setCertIssuer(''); setCertCategory('AI & Machine Learning'); setCertDate('');
                      setCertVerificationUrl(''); setCertImageFile(null); setCertPdfFile(null);
                      setExistingCertImageUrl(null); setExistingCertPdfUrl(null);
                      setIsCertModalOpen(true);
                    }}
                    className="bg-[#059669] hover:bg-[#047857] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm"
                  >
                    + Upload Certificate
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="h-36 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                        {cert.image_url ? (
                          <img src={cert.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400 font-mono">📄 [PDF Proof Attached]</span>
                        )}
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">
                          {cert.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="text-[10px] text-slate-400 font-mono">{cert.issue_date}</div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{cert.title}</h4>
                        <div className="text-slate-500 text-xs">{cert.issuer}</div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setEditingCertId(cert.id);
                              setCertTitle(cert.title);
                              setCertIssuer(cert.issuer);
                              setCertCategory(cert.category || 'AI & Machine Learning');
                              setCertDate(cert.issue_date || '');
                              setCertVerificationUrl(cert.verification_url || '');
                              setExistingCertImageUrl(cert.image_url || null);
                              setExistingCertPdfUrl(cert.pdf_url || null);
                              setCertImageFile(null); setCertPdfFile(null);
                              setIsCertModalOpen(true);
                            }}
                            className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold"
                          >
                            Edit ✏️
                          </button>
                          <button onClick={() => deleteRecord('certificates', cert.id)} className="text-xs text-rose-600 hover:underline">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Journey Logs / Offer Letters */}
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Offer Letters, Invites &amp; Summit Photos</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Documents of official offers, invited guest passes, and summit logs.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingJourneyId(null);
                      setJourneyTitle(''); setJourneyCategory('Offer Letter'); setJourneyDate('');
                      setJourneyCaption(''); setJourneyFile(null); setExistingJourneyUrl(null);
                      setIsJourneyModalOpen(true);
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm"
                  >
                    + Add Offer Letter / Milestone
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {journeyLogs.map((log) => (
                    <div key={log.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <img src={log.image_url} alt="" className="w-full h-36 object-cover" />
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-400">
                          <span className="font-bold text-emerald-700 uppercase">{log.category}</span>
                          <span className="font-mono">{log.event_date}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{log.title}</h4>
                        <p className="text-slate-500 text-xs line-clamp-2">{log.caption}</p>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setEditingJourneyId(log.id);
                              setJourneyTitle(log.title);
                              setJourneyCategory(log.category || 'Offer Letter');
                              setJourneyDate(log.event_date || '');
                              setJourneyCaption(log.caption || '');
                              setExistingJourneyUrl(log.image_url);
                              setJourneyFile(null);
                              setIsJourneyModalOpen(true);
                            }}
                            className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold"
                          >
                            Edit ✏️
                          </button>
                          <button onClick={() => deleteRecord('journey_logs', log.id)} className="text-xs text-rose-600 hover:underline">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ABOUT ME CMS */}
          {currentTab === 'profile' && !selectedCourseForModules && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">About Me CMS &amp; Customization</h1>
                <p className="text-xs text-slate-500 mt-1">Edit your narrative, quick tags, focus boxes, and skills lists. Renders live on <b>/portfolio</b>.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input type="text" required value={profName} onChange={(e) => setProfName(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Headline Badge</label>
                    <input type="text" required value={profHeadline} onChange={(e) => setProfHeadline(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio Paragraph</label>
                  <textarea rows={4} value={profBio} onChange={(e) => setProfBio(e.target.value)} className="w-full border rounded-xl p-3 text-xs leading-relaxed" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quick Status Badges (Separate with | pipe symbol)</label>
                  <input type="text" value={profQuickTags} onChange={(e) => setProfQuickTags(e.target.value)} placeholder="📍 Haripur, PK | 🎯 Active Learner | 💻 Systems & Security" className="w-full border rounded-xl p-2.5 text-xs font-mono" />
                </div>

                {/* Pillar 1 */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span> Pillar 1: Development &amp; Systems Box
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Title</label>
                      <input type="text" value={profDevTitle} onChange={(e) => setProfDevTitle(e.target.value)} className="w-full border rounded-xl p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Focus Skills (Comma separated tags)</label>
                      <input type="text" value={profDevTags} onChange={(e) => setProfDevTags(e.target.value)} className="w-full border rounded-xl p-2 text-xs font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Description</label>
                    <textarea rows={2} value={profDevDesc} onChange={(e) => setProfDevDesc(e.target.value)} className="w-full border rounded-xl p-2 text-xs" />
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🛡️</span> Pillar 2: Security Research &amp; Labs Box
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Title</label>
                      <input type="text" value={profSecTitle} onChange={(e) => setProfSecTitle(e.target.value)} className="w-full border rounded-xl p-2 text-xs" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Tooling / Lab Tags (Comma separated)</label>
                      <input type="text" value={profSecTags} onChange={(e) => setProfSecTags(e.target.value)} className="w-full border rounded-xl p-2 text-xs font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Description</label>
                    <textarea rows={2} value={profSecDesc} onChange={(e) => setProfSecDesc(e.target.value)} className="w-full border rounded-xl p-2 text-xs" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GitHub URL</label>
                    <input type="url" value={profGithub} onChange={(e) => setProfGithub(e.target.value)} className="w-full border rounded-xl p-2 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn URL</label>
                    <input type="url" value={profLinkedin} onChange={(e) => setProfLinkedin(e.target.value)} className="w-full border rounded-xl p-2 text-xs" />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload/Replace Resume PDF</label>
                  {existingResumeUrl && <div className="mb-2 text-xs text-slate-500">Active: <a href={existingResumeUrl} target="_blank" className="text-emerald-700 underline font-semibold">View Uploaded PDF</a></div>}
                  <input type="file" accept=".pdf" onChange={(e) => setProfResumeFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-xl p-2 text-xs bg-slate-50" />
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={isSavingProfile} className="bg-[#059669] hover:bg-[#047857] text-white px-6 py-2.5 rounded-xl text-xs font-semibold disabled:bg-slate-400 shadow-sm">
                    {isSavingProfile ? 'Saving...' : 'Save & Publish Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: ADMIN SECURITY PASSWORD */}
          {currentTab === 'security' && !selectedCourseForModules && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Security Credentials</h1>
                <p className="text-xs text-slate-500 mt-1">Naya password direct Supabase Database mein permanently update hoga.</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl space-y-4 shadow-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Purana Password (Old)</label>
                  <input type="password" required value={oldPasswordChange} onChange={(e) => setOldPasswordChange(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter current password" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Naya Password (New)</label>
                  <input type="password" required value={newPasswordChange} onChange={(e) => setNewPasswordChange(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Naya Password</label>
                  <input type="password" required value={confirmPasswordChange} onChange={(e) => setConfirmPasswordChange(e.target.value)} className="w-full border rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Re-enter new password" />
                </div>
                <button type="submit" disabled={isUpdatingPassword} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition disabled:bg-slate-400">
                  {isUpdatingPassword ? 'Saving to Database...' : 'Update & Permanently Save Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: COURSE TRACK */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCourse} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">{editingCourseId ? 'Edit Learning Track' : 'Create Learning Track'}</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Track Title</label>
              <input type="text" required value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="e.g. Python Programming Masterclass" className="w-full border rounded-lg p-2.5 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea rows={2} value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select value={courseCategory} onChange={(e) => setCourseCategory(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white">
                  <option value="Programming">Programming</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Tools & Systems">Tools & Systems</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Symbol Code (2-4 letters)</label>
                <input type="text" required maxLength={6} value={courseShortCode} onChange={(e) => setCourseShortCode(e.target.value)} placeholder="PY, JS, C++" className="w-full border rounded-lg p-2 text-xs font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Track Cover Image (Optional)</label>
              {existingCourseCoverUrl && <div className="text-[11px] text-slate-400 mb-1">Active cover image set</div>}
              <input type="file" accept="image/*" onChange={(e) => setCourseCoverFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg p-1.5 text-xs bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Track Roadmap / Syllabus PDF (Optional)</label>
              {existingCoursePdfUrl && <div className="text-[11px] text-slate-400 mb-1">Active syllabus PDF set</div>}
              <input type="file" accept=".pdf" onChange={(e) => setCoursePdfFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg p-1.5 text-xs bg-slate-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" disabled={isUploading} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:bg-slate-400">
                {isUploading ? 'Saving...' : 'Save Track'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: LAB PROOF */}
      {isLabModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveLabProof} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border">
            <h3 className="font-bold text-slate-900 text-base">{editingLabId ? 'Edit Lab Proof' : 'Upload Lab Folder / Multiple Proofs'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
                <input type="text" required placeholder="TryHackMe, PortSwigger, HTB" value={labPlatform} onChange={(e) => setLabPlatform(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Folder / Category</label>
                <input type="text" required placeholder="e.g. Nmap Discovery, SQLi" value={labCategory} onChange={(e) => setLabCategory(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Prefix Title (Optional)</label>
              <input type="text" placeholder="e.g. Nmap Network Recon" value={labTitle} onChange={(e) => setLabTitle(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Badge Text</label>
              <input type="text" value={labBadge} onChange={(e) => setLabBadge(e.target.value)} placeholder="100% Solved" className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {editingLabId ? 'Replace Screenshot' : 'Select Screenshots (Instant Compression Active)'}
              </label>
              {existingLabUrl && editingLabId && (
                <div className="text-[11px] text-slate-400 mb-1">Active screenshot set</div>
              )}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setLabFiles(Array.from(e.target.files));
                  }
                }}
                className="w-full border rounded-lg p-1.5 text-xs bg-slate-50"
              />
              {labFiles.length > 1 && (
                <p className="text-[11px] text-emerald-600 font-medium mt-1">
                  ⚡ {labFiles.length} screenshots ready for ultra-fast compression upload
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsLabModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" disabled={isUploading} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:bg-slate-400 transition">
                {isUploading ? (uploadProgressText || 'Compressing & Uploading...') : `Upload ${labFiles.length > 1 ? `${labFiles.length} Proofs` : 'to Lab Vault'}`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ACADEMIC COURSEWORK */}
      {isCourseworkModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCoursework} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border">
            <h3 className="font-bold text-slate-900 text-base">{editingCourseworkId ? 'Edit Coursework' : 'Upload Coursework PDF'}</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input type="text" required placeholder="e.g. Machine Learning, Assembly" value={cwSubject} onChange={(e) => setCwSubject(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select value={cwType} onChange={(e) => setCwType(e.target.value)} className="w-full border rounded-lg p-2 text-xs bg-white">
                  <option value="Assignment">Assignment</option>
                  <option value="Quiz">Quiz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input type="text" required placeholder="Assignment 01 Solution" value={cwTitle} onChange={(e) => setCwTitle(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Merged PDF</label>
              {existingCwPdfUrl && <div className="text-[11px] text-slate-400 mb-1">Active PDF attached</div>}
              <input type="file" accept=".pdf" onChange={(e) => setCwFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg p-1.5 text-xs bg-slate-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsCourseworkModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" disabled={isUploading} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:bg-slate-400">
                {isUploading ? 'Saving...' : 'Save Coursework'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: LIVE PROJECT */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProject} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border">
            <h3 className="font-bold text-slate-900 text-base">{editingProjectId ? 'Edit Project' : 'Add Live Project'}</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
              <input type="text" required value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <input type="text" required value={projCategory} onChange={(e) => setProjCategory(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vercel Live URL</label>
              <input type="url" value={projLiveUrl} onChange={(e) => setProjLiveUrl(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub URL</label>
              <input type="url" value={projGithubUrl} onChange={(e) => setProjGithubUrl(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma separated)</label>
              <input type="text" value={projTags} onChange={(e) => setProjTags(e.target.value)} placeholder="Next.js, Node.js, Vercel" className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea rows={2} value={projDesc} onChange={(e) => setProjDesc(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold">Save Project</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CERTIFICATE */}
      {isCertModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCertificate} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">{editingCertId ? 'Edit Certificate' : 'Upload Certificate Proof'}</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
              <input type="text" required placeholder="AI & Machine Learning Internship" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input type="text" required placeholder="AI & Machine Learning" value={certCategory} onChange={(e) => setCertCategory(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issuer</label>
                <input type="text" required placeholder="M-Tech Production" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input type="text" placeholder="July 2026" value={certDate} onChange={(e) => setCertDate(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Verification URL (Optional)</label>
                <input type="url" placeholder="https://coursera.org/..." value={certVerificationUrl} onChange={(e) => setCertVerificationUrl(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">1. Certificate Screenshot / Photo</label>
              {existingCertImageUrl && <div className="text-[11px] text-slate-400 mb-1">Active image attached</div>}
              <input type="file" accept="image/*" onChange={(e) => setCertImageFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg p-1.5 text-xs bg-slate-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">2. Official PDF Document (Optional)</label>
              {existingCertPdfUrl && <div className="text-[11px] text-slate-400 mb-1">Active PDF attached</div>}
              <input type="file" accept=".pdf" onChange={(e) => setCertPdfFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg p-1.5 text-xs bg-slate-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsCourseModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" disabled={isUploading} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:bg-slate-400">
                {isUploading ? 'Saving...' : 'Save Certificate'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: JOURNEY / OFFER LETTER */}
      {isJourneyModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveJourney} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border">
            <h3 className="font-bold text-slate-900 text-base">{editingJourneyId ? 'Edit Milestone' : 'Add Offer Letter / Milestone'}</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
              <input type="text" required placeholder="Offer Letter / Summit Invite" value={journeyTitle} onChange={(e) => setJourneyTitle(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <input type="text" placeholder="Offer Letter, Summit" value={journeyCategory} onChange={(e) => setJourneyCategory(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input type="text" placeholder="2026" value={journeyDate} onChange={(e) => setJourneyDate(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Caption</label>
              <textarea rows={2} value={journeyCaption} onChange={(e) => setJourneyCaption(e.target.value)} className="w-full border rounded-lg p-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Screenshot / Picture</label>
              {existingJourneyUrl && <div className="text-[11px] text-slate-400 mb-1">Active screenshot set</div>}
              <input type="file" accept="image/*,.pdf" onChange={(e) => setJourneyFile(e.target.files ? e.target.files[0] : null)} className="w-full border rounded-lg p-1.5 text-xs bg-slate-50" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" onClick={() => setIsJourneyModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button type="submit" disabled={isUploading} className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold disabled:bg-slate-400">
                {isUploading ? 'Saving...' : 'Publish Milestone'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}