// prisma/seed.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const projects = [
  {
    title: "เว็บแผนที่มหาลัยมทร.ตาก",
    category: "Web Project",
    shortDesc: "เว็บแผนที่มหาวิทยาลัย แบบสามมิติ ระบุตำแหน่งได้",
    fullDesc: "เว็บแผนที่มหาวิทยาลัยเทคโนโลยีราชมงคลตาก ที่พัฒนาด้วย html css js ธรรมดาทำหน้าบ้าน ใช้ไลบรารี่ Three.js แสดงโมเดล 3D ที่ปั้นเองจากโปรแกรม Blender โดยมีฟีเจอร์เด่นคือ การแสดงแผนที่แบบสามมิติ และการระบุตำแหน่งอาคารต่างๆภายในมหาวิทยาลัย สามารถรับตำแหน่งของผู้ใช้มาระบุพิกัดบนแผนที่ได้ มีแผนผังโครงสร้างอาคารและวิดีโอนำทางไปยังห้องที่ค้นหา ช่วยให้นักศึกษาและผู้มาเยือนได้รับประสบการณ์การนำทางที่สะดวกสบายยิ่งขึ้น",
    tools: ["HTML", "CSS", "Javascript", "Three.js", "Blender"],
    url: "https://rmutltakmap.netlify.app/",
    coverImage: "https://legziqijhimwjzcvjdff.supabase.co/storage/v1/object/public/portfolio/1.jpg",
    images: [
        "https://legziqijhimwjzcvjdff.supabase.co/storage/v1/object/public/portfolio/1.jpg",
        "https://legziqijhimwjzcvjdff.supabase.co/storage/v1/object/public/portfolio/1_1.png",
        "https://legziqijhimwjzcvjdff.supabase.co/storage/v1/object/public/portfolio/1_2.png"
    ]
  }
]

async function main() {
  console.log('Start seeding...')
  await prisma.work.deleteMany()
  for (const project of projects) {
    await prisma.work.create({ data: project })
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })