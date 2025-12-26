'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Code2, Layers, Loader2 } from 'lucide-react'

// --- Types ---
type Project = {
    id: number;
    title: string;
    category: string;
    shortDesc: string;
    fullDesc: string;
    tools: string[];
    url: string;
    coverImage: string;
    images: string[];
}

// --- Component: Smooth Image Slider ---
const ImageSlider = ({ images }: { images: string[] }) => {
    const [index, setIndex] = useState(0);

    // Auto Slide Logic (3 วินาที)
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [images.length]);

    // Variants สำหรับการสไลด์
    const variants = {
        enter: { x: "100%", opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 }
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-900">
            <AnimatePresence initial={false} mode='popLayout'>
                <motion.img
                    key={index}
                    src={images[index]}
                    alt={`Slide ${index}`}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 }, // ปรับความเด้ง/นุ่ม ตรงนี้
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />
            </AnimatePresence>
            
            {/* Dots Indicator (Optional: ให้รู้ว่ารูปเปลี่ยน) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, idx) => (
                    <div 
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                    />
                ))}
            </div>

            {/* Gradient Overlay ด้านล่างเพื่อให้ Text อ่านง่าย */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent pointer-events-none" />
        </div>
    );
};

function Work() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/works'); 
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                Selected Work
            </h1>
            <p className="text-slate-400">
                A showcase of my projects and technical experiments.
            </p>
        </motion.div>

        {loading ? (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        ) : (
            /* --- GRID --- */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <motion.div
                    key={project.id}
                    layoutId={`card-${project.id}`} 
                    onClick={() => setSelectedId(project.id)}
                    className="cursor-pointer group relative overflow-hidden rounded-3xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-colors"
                    whileHover={{ y: -5 }}
                >
                    {/* Image Container (ใช้ layoutId ที่นี่เพื่อการขยายที่สมูท) */}
                    <motion.div 
                        layoutId={`image-container-${project.id}`}
                        className="h-48 w-full relative overflow-hidden"
                    >
                        <motion.img 
                            src={project.coverImage} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </motion.div>
                    
                    <div className="p-6">
                        <motion.h2 layoutId={`title-${project.id}`} className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                            {project.title}
                        </motion.h2>
                        <motion.p layoutId={`category-${project.id}`} className="text-xs font-mono text-slate-400 mb-4 px-2 py-1 bg-slate-900/50 rounded w-fit">
                            {project.category}
                        </motion.p>
                        <p className="text-slate-300 text-sm line-clamp-2">
                            {project.shortDesc}
                        </p>
                    </div>
                </motion.div>
            ))}
            </div>
        )}

        {/* --- MODAL POPUP --- */}
        <AnimatePresence>
          {selectedId && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)} 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              {/* Card Container */}
              <motion.div
                layoutId={`card-${selectedId}`} 
                className="w-full max-w-2xl bg-[#1e293b] rounded-3xl overflow-hidden relative z-10 shadow-2xl border border-slate-700"
              >
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white z-20 transition-colors"
                >
                    <X size={20} />
                </button>

                {(() => {
                    const project = projects.find(p => p.id === selectedId)!;
                    return (
                        <>
                            {/* Image Slider Section */}
                            <motion.div 
                                layoutId={`image-container-${project.id}`}
                                className="h-72 w-full relative bg-slate-900"
                            >
                                {/* ถ้ามีหลายรูป -> ใช้ Slider, ถ้ามีรูปเดียว -> ใช้รูปปกติ */}
                                {project.images && project.images.length > 0 ? (
                                    <ImageSlider images={project.images} />
                                ) : (
                                    <img 
                                        src={project.coverImage} 
                                        className="w-full h-full object-cover"
                                        alt={project.title}
                                    />
                                )}

                                {/* Overlay Text on Image */}
                                <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                                    <motion.p layoutId={`category-${project.id}`} className="text-sm font-mono text-indigo-300 mb-2 flex items-center gap-2">
                                        <Layers size={14} /> {project.category}
                                    </motion.p>
                                    <motion.h2 layoutId={`title-${project.id}`} className="text-3xl font-bold text-white drop-shadow-md">
                                        {project.title}
                                    </motion.h2>
                                </div>
                            </motion.div>

                            {/* Content Section */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.15 }} // Delay นิดนึงให้ Slider มาก่อน
                                className="p-8"
                            >
                                <p className="text-slate-300 leading-relaxed mb-8 text-lg">
                                    {project.fullDesc}
                                </p>
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Code2 size={16} /> Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools.map((tool) => (
                                            <span key={tool} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-indigo-300">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <a href={project.url} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-2 w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
                                >
                                    Visit Website <ExternalLink size={18} />
                                </a>
                            </motion.div>
                        </>
                    );
                })()}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Work