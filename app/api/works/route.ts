import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const works = await prisma.work.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(works);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch works" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Log ดูข้อมูลที่รับมา
    console.log("📥 Receiving Data:", body);

    // 2. ตรวจสอบข้อมูลบังคับ (Validation)
    // เช็ค coverImage ด้วย เพราะใน Schema ห้ามว่าง
    if (!body.title || !body.category || !body.coverImage) {
      console.error("❌ Validation Failed: Missing required fields");
      return NextResponse.json(
        { error: "Title, Category, and Cover Image are required!" }, 
        { status: 400 }
      );
    }

    // 3. เตรียมข้อมูลบันทึก (ตัด color ออกแล้ว!)
    const newWork = await prisma.work.create({
      data: {
        title: body.title,
        category: body.category,
        shortDesc: body.shortDesc || "-",
        fullDesc: body.fullDesc || "-",
        url: body.url || "#",
        // color: ... ลบออกแล้ว เพราะ Schema ไม่มี
        coverImage: body.coverImage, 
        images: Array.isArray(body.images) ? body.images : [],
        tools: Array.isArray(body.tools) ? body.tools : [],
      },
    });

    console.log("✅ Created Success:", newWork);
    return NextResponse.json(newWork, { status: 201 });

  } catch (error: any) {
    // 4. ถ้ายังพัง ให้ดู Error ตรงนี้ใน Terminal VS Code
    console.error("❌ SERVER ERROR:", error);
    
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}