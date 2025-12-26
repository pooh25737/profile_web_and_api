
// rfc
// rfce
'use client'

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Link from 'next/link';

const HomePage = () => {
  // --- Setup 3D Tilt (ขยับตามเมาส์ทั่วหน้าจอ) ---
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // --- Variants ---
  
  // 1. การ์ดพื้นหลัง (ตัวที่ล้ม)
  const cardBgVariants = {
    initial: { rotateX: 0, scale: 1, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
    hover: { 
      rotateX: 75, // ล้มหงายหลัง
      scale: 0.9, 
      y: 30, // กดต่ำลงหน่อย
      boxShadow: '0 50px 100px -20px rgba(99, 102, 241, 0.3)',
      transition: { type: "spring", stiffness: 120, damping: 15 } 
    }
  };

  // 2. เนื้อหาปกติ (Icon) - หายไป
  const defaultContentVariants = {
    initial: { opacity: 1, scale: 1, y: 0 },
    hover: { opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }
  };

  // 3. เนื้อหาใหม่ (Text) - เด้งขึ้นมา
  const popupTextVariants = {
    initial: { opacity: 0, scale: 0.5, y: 50 }, // เริ่มต้นซ่อนอยู่ข้างล่าง
    hover: { 
      opacity: 1, 
      scale: 1, 
      y: 0, // เด้งขึ้นมาอยู่ตรงกลาง (ไม่ต้องหมุน rotateX ใดๆ ทั้งสิ้น!)
      transition: { type: "spring", stiffness: 300, damping: 20, delay: 0.1 } 
    }
  };

  // Variants สำหรับ Stagger ตอนโหลดหน้าแรก
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const fadeInUp = { hidden: { y: 60, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8 } } };

  return (
    <div style={styles.pageContainer} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={ref}>
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x: [0, 150, -100, 0], y: [0, -100, 100, 0], scale: [1, 1.5, 0.8, 1] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ ...styles.orb, background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(0,0,0,0) 70%)', top: '-10%', left: '-10%' }} />
        <motion.div animate={{ x: [0, -200, 100, 0], y: [0, 150, -150, 0], scale: [1, 0.9, 1.4, 1] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ ...styles.orb, background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(0,0,0,0) 70%)', bottom: '-10%', right: '-10%' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', zIndex: -1 }}></div>
      </div>

      {/* Hero Section */}
      <motion.main variants={containerVariants} initial="hidden" animate="visible" style={styles.heroSection}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
            
            {/* Left Content: เปลี่ยน Text ให้เป็น Portfolio จริงจัง */}
            <div>
                <motion.h1 variants={fadeInUp} style={styles.heroTitle}>
                  Crafting Digital <br /> <span style={styles.gradientText}>Experiences.</span>
                </motion.h1>
                <motion.p variants={fadeInUp} style={styles.heroSubtitle}>
                  สวัสดีครับ! ผมเป็นนักพัฒนาเว็บที่หลงใหลในการสร้างสรรค์ User Interface ที่สวยงามและลื่นไหล เปลี่ยนไอเดียให้กลายเป็นความจริงด้วยโค้ดคุณภาพ
                </motion.p>
                <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                  {/* เปลี่ยน Link และ Text ปุ่ม */}
                  <Link href="/about">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.primaryButton}>
                        About Me
                    </motion.button>
                  </Link>
                  {/* ปุ่มนี้เลื่อนลงไปดูงาน (ต้องมี id="work" ที่ section ข้างล่าง แต่ถ้ายังไม่มี ให้ลิงก์ไปหน้าอื่นก่อนได้) */}
                  <Link href="/work"> 
                     <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.secondaryButton}>
                        My Work
                     </motion.button>
                  </Link>
                </motion.div>
            </div>

            {/* Right Content: 3D Layered Card */}
            <motion.div variants={fadeInUp} style={{ perspective: 1200, height: '400px', display: 'flex', alignItems: 'center' }}>
                <motion.div 
                    initial="initial"
                    whileHover="hover"
                    style={{ rotateX: rotateX, rotateY: rotateY, width: '100%', height: '300px', position: 'relative', cursor: 'pointer', transformStyle: 'preserve-3d' }}
                > 
                  {/* Layer 1: การ์ดพื้นหลัง */}
                  <motion.div 
                    variants={cardBgVariants}
                    style={{ ...styles.glassCard, position: 'absolute', inset: 0, zIndex: 0, transformOrigin: 'bottom center' }} 
                  />

                  {/* Layer 2: เนื้อหาเดิม (เปลี่ยน Text นิดหน่อย) */}
                  <motion.div 
                    variants={defaultContentVariants} 
                    style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1, pointerEvents: 'none' }}
                  >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(to right, #6366F1, #EC4899)', marginBottom: 20 }} />
                        <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>Developer Profile</h3>
                        <p style={{ color: '#9ca3af' }}>Hover to reveal info</p>
                  </motion.div>

                  {/* Layer 3: Text ใหม่ (เปลี่ยนเป็นข้อมูลติดต่อหรือสโลแกน) */}
                  <motion.div 
    variants={popupTextVariants}
    // ตัวแม่คง pointerEvents: 'none' ไว้ เพื่อให้คลิกทะลุพื้นที่ว่างๆ ได้
    style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2, pointerEvents: 'none' }}
>
    <div 
        // 1. ใส่ฟังก์ชันเปิดลิงก์ ( _blank คือเปิดหน้าใหม่ )
        onClick={() => window.open("https://github.com/pooh25737", "_blank")}
        style={{ 
            background: 'rgba(0,0,0,0.6)', 
            padding: '25px', 
            borderRadius: '20px', 
            backdropFilter: 'blur(8px)', 
            border: '1px solid rgba(255,255,255,0.2)', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            // 2. สำคัญมาก! ต้องเปิดให้รับการคลิกเฉพาะที่กล่องนี้
            pointerEvents: 'auto', 
            // 3. เปลี่ยนเมาส์เป็นรูปนิ้วมือ
            cursor: 'pointer' 
        }}
    >
        <h3 style={{ color: '#F472B6', fontSize: '1.8rem', marginBottom: '10px', fontWeight: 'bold', textAlign: 'center' }}>
            Let's Connect! 🚀
        </h3>
        <p style={{ color: 'white', textAlign: 'center', lineHeight: 1.5, fontSize: '1rem', whiteSpace: 'nowrap' }}>
            Git Hub Profile <br/>
            <span style={{ color: '#818cf8', fontWeight: 'bold' }}>Contact Me Now</span>
        </p>
    </div>
</motion.div>

                </motion.div>
            </motion.div>
        </div>
      </motion.main>

      {/* Features Section (เปลี่ยนเนื้อหาเป็น Service หรือ Skill จุดเด่นของคุณ) */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.8 }} style={{ textAlign: 'center', color: 'white', fontSize: '2.5rem', marginBottom: '60px' }}>
            My <span style={styles.gradientText}>Expertise</span>
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            {/* Card 1: Fast & Optimized */}
            <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: "-100px" }} transition={{ duration: 0.8 }} style={styles.featureCard}>
                <div style={styles.icon}>⚡</div>
                <h3 style={styles.featureTitle}>Fast Performance</h3>
                <p style={styles.featureText}>พัฒนาเว็บไซต์ด้วย Next.js ที่โหลดเร็ว รองรับ SEO และปรับแต่งให้ได้คะแนน Performance สูงสุด</p>
            </motion.div>
            
            {/* Card 2: Modern Design */}
            <motion.div initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.1 }} style={styles.featureCard}>
                <div style={styles.icon}>🎨</div>
                <h3 style={styles.featureTitle}>Modern Design</h3>
                <p style={styles.featureText}>ออกแบบ UI/UX ที่ทันสมัย สวยงาม และใช้งานง่าย (User-Friendly) ด้วย Tailwind CSS</p>
            </motion.div>
            
            {/* Card 3: Interactive */}
            <motion.div initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }} style={styles.featureCard}>
                <div style={styles.icon}>✨</div>
                <h3 style={styles.featureTitle}>Interactive</h3>
                <p style={styles.featureText}>เพิ่มลูกเล่นด้วย Animation จาก Framer Motion ให้เว็บดูมีชีวิตชีวา ไม่น่าเบื่อ</p>
            </motion.div>

        </div>
      </section>
      <div style={{ height: '300px' }}></div> 
    </div>
  );
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: { minHeight: '100vh', background: '#0f172a', overflowX: 'hidden', position: 'relative' },
  orb: { position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', filter: 'blur(120px)', zIndex: -2 },
  heroSection: { padding: '180px 20px 100px', minHeight: '90vh', display: 'flex', alignItems: 'center' },
  heroTitle: { fontSize: '4rem', fontWeight: '800', color: 'white', lineHeight: 1.1, marginBottom: '24px' },
  gradientText: { background: 'linear-gradient(to right, #6366F1, #EC4899, #06B6D4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  heroSubtitle: { fontSize: '1.25rem', color: '#9ca3af', maxWidth: '500px', lineHeight: 1.6 },
  primaryButton: { padding: '16px 32px', borderRadius: '99px', background: 'linear-gradient(to right, #6366F1, #EC4899)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1rem' },
  secondaryButton: { padding: '16px 32px', borderRadius: '99px', border: '2px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  glassCard: { background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', padding: '40px', height: '100%', width: '100%' }, 
  featureCard: { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', padding: '30px', textAlign: 'center' },
  icon: { fontSize: '3rem', marginBottom: '20px' },
  featureTitle: { color: 'white', fontSize: '1.5rem', marginBottom: '10px' },
  featureText: { color: '#9ca3af', lineHeight: 1.5 }
};

export default HomePage;