import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      // Lazy-imported so this heavy PDF.js-based parser only loads when a
      // PDF actually comes in.
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      return NextResponse.json({ text: result.text });
    }

    if (name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    }

    if (name.endsWith(".txt")) {
      return NextResponse.json({ text: buffer.toString("utf-8") });
    }

    return NextResponse.json(
      { error: "Unsupported file type. Please upload a PDF, .docx, or .txt file." },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { error: "Couldn't read that file. It may be corrupted or an unsupported format." },
      { status: 422 },
    );
  }
}
