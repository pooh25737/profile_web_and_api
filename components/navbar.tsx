'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  const links = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-slate-900/50 backdrop-blur-md border-b border-white/5"
    >
      
      {/* Logo Zone */}
      <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
        MY PORTFOLIO
      </Link>

      {/* Menu Links */}
      <div className='flex gap-2 relative'> 
        {links.map((link) => {
            const isActive = pathname === link.href;
            
            return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}
              `}
              onMouseEnter={() => setHoveredIndex(link.name)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Active State (Pill สีขาว/สว่าง) */}


              {/* Hover State (Pill จางๆ) */}
              {hoveredIndex === link.name && !isActive && (
                  <motion.span
                    layoutId="hoverPill"
                    className="absolute inset-0 bg-white/5 rounded-full"
                    style={{ zIndex: -2 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  />
              )}

              <span className="relative z-10 tracking-wide">{link.name}</span>
            </Link>
        )})}
      </div>
    </motion.nav>
  )
}

export default Navbar