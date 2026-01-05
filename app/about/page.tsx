'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Cpu, Globe, GraduationCap, Briefcase, User, Download } from 'lucide-react'

// --- 1. ข้อมูลสกิล (แก้ไขตรงนี้) ---
const skills = [
    { name: "Next.js", level: "Advanced", icon: <Globe size={20} /> },
    { name: "React", level: "Advanced", icon: <Code2 size={20} /> },
    { name: "TypeScript", level: "Intermediate", icon: <Cpu size={20} /> },
    { name: "Tailwind CSS", level: "Advanced", icon: <Code2 size={20} /> },
    { name: "Framer Motion", level: "Intermediate", icon: <Cpu size={20} /> },
    { name: "Node.js", level: "Intermediate", icon: <Code2 size={20} /> },
    { name: "PostgreSQL", level: "Basic", icon: <Globe size={20} /> },
    { name: "Docker", level: "Basic", icon: <Cpu size={20} /> },
]

// --- 2. ข้อมูล Timeline (แก้ไขตรงนี้) ---
const timeline = [
    {
        year: "2026 - Present",
        title: "Freelance Full Stack Developer",
        place: "Remote",
        desc: "รับทำเว็บแอปพลิเคชันด้วย Next.js และ Supabase เน้นงาน Dashboard และ E-commerce",
        icon: <Briefcase size={18} />
    },
    {
        year: "2025",
        title: "Junior Web Developer (Intern)",
        place: "BIG DATA AGENCY CO., LTD.",
        desc: "ช่วยทีม Frontend ทำ UI Component ด้วย vue.js ฝึกใช้งาน Docker, Prisma, PostgreSQL, Laravel ในหลังบ้าน",
        icon: <Briefcase size={18} />
    },
    {
        year: "2020 - 2026",
        title: "Computer Engineering Bachelor Degree",
        place: "RMUTL Tak University",
        desc: "ศึกษาเกี่ยวกับการเขียนโปรแกรม, HTML CSS, JavaScript, Git control และ Algorithms",
        icon: <GraduationCap size={18} />
    }
]

// --- Animation Variants ---
const containerVar = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
}

const itemVar = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-indigo-500/30 overflow-hidden">
        
        {/* Background Effects */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 relative z-10">
            
            {/* === Section 1: Intro / Bio === */}
            <motion.div 
                variants={containerVar}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24"
            >
                {/* Left: Image / Avatar Placeholder */}
                <motion.div variants={itemVar} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative h-[500px] w-full bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
                        {/* ถ้ามีรูปตัวเอง ใส่ <img src="..." /> ตรงนี้ได้เลย */}
                        <img src="https://legziqijhimwjzcvjdff.supabase.co/storage/v1/object/public/portfolio/pooh.jpg" alt="My Photo" className="object-cover w-full h-full" />
                        
                    </div>
                </motion.div>

                {/* Right: Text Content */}
                <motion.div variants={itemVar}>
                    <h2 className="text-indigo-400 font-mono text-sm mb-4 tracking-wider">01. // ABOUT ME</h2>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Transforming ideas into <br/>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                            Digital Reality.
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6">
                        สวัสดีครับ! ผมเป็นนักพัฒนาเว็บไซต์ที่หลงใหลในการสร้าง User Experience ที่ลื่นไหลและสวยงาม 
                        ผมเริ่มต้นเขียนโค้ดจากการทำโปรเจคเล่นๆ จนกลายมาเป็นความจริงจังในการสร้าง Software ที่แก้ปัญหาได้จริง
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8">
                        ปัจจุบันผมโฟกัสที่การใช้ <b>Next.js</b> และ <b>Eco-system ของ React</b> ในการพัฒนาเว็บแอปพลิเคชันที่มีประสิทธิภาพสูง
                    </p>

                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-indigo-50 transition-colors">
                        <Download size={20} /> Download Resume
                    </button>
                </motion.div>
            </motion.div>


            {/* === Section 2: Tech Stack (My Arsenal) === */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="mb-24"
            >
                <div className="text-center mb-12">
                    <h2 className="text-indigo-400 font-mono text-sm mb-2 tracking-wider">02. // MY ARSENAL</h2>
                    <h3 className="text-3xl font-bold">Technologies I Use</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {skills.map((skill, index) => (
                        <motion.div 
                            key={index}
                            whileHover={{ scale: 1.05, borderColor: "rgba(99, 102, 241, 0.5)" }}
                            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl flex items-center gap-4 cursor-default"
                        >
                            <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
                                {skill.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">{skill.name}</h4>
                                <p className="text-xs text-slate-500">{skill.level}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>


            {/* === Section 3: Journey (Timeline) === */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="mb-12">
                     <h2 className="text-indigo-400 font-mono text-sm mb-2 tracking-wider">03. // THE JOURNEY</h2>
                     <h3 className="text-3xl font-bold">Experience & Education</h3>
                </div>

                <div className="relative border-l-2 border-slate-800 ml-4 md:ml-10 space-y-12">
                    {timeline.map((item, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Dot */}
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            
                            {/* Content */}
                            <div>
                                <span className="text-xs font-mono text-indigo-400 mb-1 block">{item.year}</span>
                                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                                    {item.title}
                                </h4>
                                <div className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                                   {item.icon} {item.place}
                                </div>
                                <p className="text-slate-400 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

        </div>
    </div>
  )
}

export default AboutPage