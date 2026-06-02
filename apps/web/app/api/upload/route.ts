import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename to prevent overwriting
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const extension = path.extname(file.name);
    const filename = `${path.basename(file.name, extension)}-${uniqueSuffix}${extension}`;

    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);

    // Save the file
    await writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ success: true, fileUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
