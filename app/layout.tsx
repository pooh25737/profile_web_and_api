import Navbar from '@/components/navbar'
import React from 'react'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'myapp',
  description: 'Next.js 15 tutorial',
  keywords:'pooh,camping,Thailand,Next.js'
}
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}

export default layout