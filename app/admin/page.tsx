'use client'

import React, { useState, useEffect } from 'react'

import { createBrowserClient } from '@supabase/ssr'

import { Trash2, Edit, Plus, Upload, Loader2, X, Image as ImageIcon, Save, LogOut } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter() // เพิ่ม Router ไว้เผื่อ Logout

  // ✅ สร้าง Client แบบ Browser (ดึง Session อัตโนมัติ)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Project>(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- ส่วนอื่นๆ เหมือนเดิม ---
  // Load Data
  const fetchProjects = async () => {
    try {
        const res = await fetch('/api/works');
        const data = await res.json();
        setProjects(data);
    } catch (error) {
        toast.error("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Logout Function
  const handleLogout = async () => {
      await supabase.auth.signOut();
      router.refresh();
      router.push('/login');
  }

  // --- Logic อัปโหลดรูป ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const uploadToast = toast.loading('กำลังอัปโหลดรูปภาพ...');
    setUploading(true);

    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    try {
      // เช็คก่อนว่า Login อยู่ไหม
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("กรุณา Login ใหม่");

      for (const file of files) {
        // ตั้งชื่อไฟล์ให้ปลอดภัย (ตัดภาษาไทยออก/ใช้อักษรภาษาอังกฤษ)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      if (isCover) {
        setFormData({ ...formData, coverImage: uploadedUrls[0] });
      } else {
        setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
      }
      
      toast.success('อัปโหลดรูปภาพสำเร็จ!', { id: uploadToast });

    } catch (error: any) {
      console.error('Upload Error:', error);
      toast.error(`อัปโหลดไม่ผ่าน: ${error.message}`, { id: uploadToast });
    } finally {
      setUploading(false);
      e.target.value = ''; 
    }
  };

  // --- Submit Form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.coverImage) {
        toast.error("กรุณาอัปโหลดรูปปกด้วยครับ");
        return;
    }

    setLoading(true);
    const savingToast = toast.loading('กำลังบันทึกข้อมูล...');

    try {
      let res: Response | null = null;

      const payload = {
        ...formData,
        tools: typeof formData.tools === 'string' 
               ? (formData.tools as string).split(',').map((t: string) => t.trim()).filter((t: string) => t !== "")
               : formData.tools
      };

      if (isEditing && formData.id) {
        res = await fetch(`/api/works/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/works', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      if (!res || !res.ok) {
        const errorData = await res?.json().catch(() => ({})); 
        throw new Error(errorData.error || `Server Error`);
      }

      setFormData(initialForm);
      setIsEditing(false);
      fetchProjects();
      toast.success(isEditing ? 'แก้ไขข้อมูลเรียบร้อย!' : 'เพิ่มโปรเจคใหม่สำเร็จ!', { id: savingToast });

    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`, { id: savingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันที่จะลบโปรเจคนี้?')) return;
    
    const deleteToast = toast.loading('กำลังลบ...');
    try {
        await fetch(`/api/works/${id}`, { method: 'DELETE' });
        fetchProjects();
        toast.success('ลบข้อมูลสำเร็จ', { id: deleteToast });
    } catch (error) {
        toast.error('ลบข้อมูลไม่สำเร็จ', { id: deleteToast });
    }
  };

  const handleToolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const toolsArray = e.target.value.split(',').map(t => t.trim());
    setFormData({ ...formData, tools: toolsArray });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30 pt-32">
      <Toaster position="top-right" toastOptions={{
          style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155'
          }
      }} />

      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
            <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400 mt-2">จัดการข้อมูล Portfolio ของคุณได้ที่นี่</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 text-sm text-slate-400">
                    Total: <span className="text-white font-bold">{projects.length}</span>
                </div>
                {/* ปุ่ม Logout */}
                <button onClick={handleLogout} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: FORM SECTION --- */}
          <div className="lg:col-span-4 h-fit space-y-6 sticky top-8">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white border-b border-slate-700 pb-4">
                {isEditing ? <Edit className="text-yellow-400" size={24}/> : <Plus className="text-emerald-400" size={24}/>} 
                {isEditing ? 'Edit Project' : 'New Project'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                {/* Inputs Group */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <input 
                            type="text" placeholder="Project Name" required
                            className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
                            <input 
                                type="text" placeholder="Web / AI" required
                                className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Link URL</label>
                            <input 
                                type="text" placeholder="https://..." required
                                className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                                value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Short Description</label>
                        <input 
                            type="text" placeholder="คำอธิบายสั้นๆ" required
                            className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                            value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Description</label>
                        <TextareaAutosize
                            minRows={4}
                            placeholder="รายละเอียดเต็มๆ..."
                            required
                            className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 resize-none"
                            value={formData.fullDesc}
                            onChange={e => setFormData({...formData, fullDesc: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tools (Comma separated)</label>
                        <input 
                            type="text" placeholder="React, Next.js, Tailwind"
                            className="w-full bg-slate-900/80 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                            value={formData.tools.join(', ')} 
                            onChange={handleToolsChange}
                        />
                    </div>
                </div>

                {/* --- UPLOAD UI --- */}
                <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Cover Image (Required)</label>
                    <div className="relative group">
                        <label className={`
                            flex flex-col items-center justify-center w-full h-32 
                            border-2 border-dashed rounded-xl cursor-pointer transition-all
                            ${formData.coverImage ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800'}
                        `}>
                            {formData.coverImage ? (
                                <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover rounded-xl" />
                            ) : (
                                <div className="flex flex-col items-center pt-5 pb-6 text-slate-400 group-hover:text-indigo-400">
                                    {uploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="w-8 h-8 mb-2" />}
                                    <p className="text-sm font-semibold">Click to upload cover</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, true)} disabled={uploading} />
                        </label>
                        
                        {formData.coverImage && (
                            <button 
                                type="button"
                                onClick={(e) => { e.preventDefault(); setFormData({...formData, coverImage: ''})}}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* 2. Gallery Images */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Gallery Images</label>
                    
                    <div className="grid grid-cols-4 gap-2 mb-2">
                        {formData.images.map((img, idx) => (
                            <div key={idx} className="relative group aspect-square">
                                <img src={img} alt="Gallery" className="w-full h-full object-cover rounded-lg border border-slate-600" />
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-slate-800 transition-all">
                             {uploading ? <Loader2 className="animate-spin text-slate-400" size={20}/> : <Plus className="text-slate-400 group-hover:text-indigo-400" />}
                             <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleUpload(e, false)} disabled={uploading} />
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button 
                    type="submit" disabled={loading || uploading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    {isEditing ? 'Update Project' : 'Create Project'}
                    </button>
                    
                    {isEditing && (
                    <button 
                        type="button" onClick={() => { setIsEditing(false); setFormData(initialForm); }}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 py-3 px-6 rounded-xl font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    )}
                </div>
                </form>
            </div>
          </div>

          {/* --- RIGHT: LIST SECTION --- */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-300">
                <ImageIcon size={20} /> Project List
            </h2>

            {projects.length === 0 ? (
                <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center text-slate-500">
                    <p>ยังไม่มีโปรเจคเลย... เริ่มสร้างอันแรกสิ!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-slate-800 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10">
                            {/* รูปภาพ */}
                            <div className="h-48 w-full rounded-xl overflow-hidden bg-slate-900 relative">
                                <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm p-1.5 rounded-lg">
                                    <button 
                                        onClick={() => { setIsEditing(true); setFormData(project as Project); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-lg"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => project.id && handleDelete(project.id)}
                                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors shadow-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* เนื้อหา */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-white line-clamp-1">{project.title}</h3>
                                    <span className="text-xs font-mono px-2 py-1 bg-slate-900 rounded text-indigo-400 border border-slate-700">
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-3 h-10">{project.shortDesc}</p>
                                
                                <div className="flex flex-wrap gap-1">
                                    {project.tools.slice(0, 3).map((t, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-slate-700/50 rounded-md text-slate-300">
                                            {t}
                                        </span>
                                    ))}
                                    {project.tools.length > 3 && (
                                        <span className="text-[10px] px-2 py-1 bg-slate-700/50 rounded-md text-slate-400">+{project.tools.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

// Types and Initial Form...
type Project = {
  id?: number;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  tools: string[];
  url: string;
  coverImage: string;
  images: string[];
}

const initialForm: Project = {
  title: '', category: '', shortDesc: '', fullDesc: '',
  tools: [], url: '', coverImage: '', images: []
}