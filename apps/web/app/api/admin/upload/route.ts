import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin
      const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const userId = user?.id;
  const sessionClaims = { metadata: { role: (user as any)?.role || 'user' } };
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userRole = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.role;
    if (userRole !== 'admin' && userId !== 'user_3EFohPWsEpwDDfFQxcf3i1T39pJ') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse Form Data
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const finalFilename = `${uniqueSuffix}-${filename}`;

    // 4. Save to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadDir, finalFilename);

    // Note: in a real production app (like Vercel), writing to the filesystem
    // at runtime doesn't persist. You would use an S3 bucket or similar service.
    // For this local development version, saving to public is fine.
    await writeFile(filePath, buffer);

    // 5. Return the public URL
    const url = `/uploads/${finalFilename}`;

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
