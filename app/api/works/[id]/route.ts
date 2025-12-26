import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE: ลบข้อมูล
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.work.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// PUT: แก้ไขข้อมูล
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedWork = await prisma.work.update({
        where: { id: Number(id) },
        data: {
            title: body.title,
            category: body.category,
            shortDesc: body.shortDesc,
            fullDesc: body.fullDesc,
            url: body.url,
            coverImage: body.coverImage,
            // ต้องเช็คว่าเป็น Array ไหม ถ้าไม่เป็นให้ใส่ Array ว่าง
            images: Array.isArray(body.images) ? body.images : [], 
            tools: Array.isArray(body.tools) ? body.tools : [],
        }
    });
    return NextResponse.json(updatedWork);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}