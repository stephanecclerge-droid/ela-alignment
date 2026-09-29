import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { STANDARDS } from "@/lib/standards";
import { createClient } from "@/lib/supabase/server";

// This file runs only on the server, never in the browser — the API key
// is only ever read here via process.env, never sent to the client.
const client = new Anthropic();

const RESULT_SCHEMA = {
  type: "object" as const,
  properties: {
    alignmentLevel: {
      type: "string",
      enum: ["strong", "partial", "weak"],
      description: "Overall read of how well the lesson matches the standard.",
    },
    summary: {
      type: "string",
      description: "2-3 sentence plain-English summary of the alignment.",
    },
    gaps: {
      type: "array",
      items: { type: "string" },
      description: "Specific, concrete gaps between the lesson and what the standard demands.",
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "Concrete next steps the teacher could take to strengthen alignment.",
    },
    studentPlainLanguageNote: {
      type: "string",
      description: "A plain-language note the teacher could share with students, tailored to this specific lesson, explaining what's actually expected of them.",
    },
  },
  required: ["alignmentLevel", "summary", "gaps", "recommendations", "studentPlainLanguageNote"],
  additionalProperties: false,
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { standardCode, lessonText } = await req.json();

  if (typeof standardCode !== "string" || typeof lessonText !== "string" || !lessonText.trim()) {
    return NextResponse.json(
      { error: "Missing standardCode or lessonText." },
      { status: 400 },
    );
  }

  const standard = STANDARDS.find((s) => s.code === standardCode);
  if (!standard) {
    return NextResponse.json({ error: "Unknown standard code." }, { status: 400 });
  }

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system:
      "You are a supplement to a real ELA teacher's own expertise, not a replacement for their judgment. " +
      "Give a specific, concrete read of how well a lesson aligns to a standard, grounded in the actual lesson " +
      "text provided — never generic ELA advice. The teacher will review and decide what to act on themselves.",
    messages: [
      {
        role: "user",
        content:
          `Standard ${standard.code}: "${standard.officialText}"\n\n` +
          `What this standard actually demands:\n${standard.teacherBreakdown.map((b) => `- ${b}`).join("\n")}\n\n` +
          `The teacher's lesson:\n"""\n${lessonText}\n"""\n\n` +
          `Analyze how well this specific lesson aligns to this specific standard.`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: RESULT_SCHEMA },
    },
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No analysis returned." }, { status: 502 });
  }

  const result = JSON.parse(textBlock.text);

  const { error: saveError } = await supabase.from("analyses").insert({
    user_id: user.id,
    standard_code: standardCode,
    lesson_text: lessonText,
    alignment_level: result.alignmentLevel,
    summary: result.summary,
    gaps: result.gaps,
    recommendations: result.recommendations,
    student_plain_language_note: result.studentPlainLanguageNote,
  });

  if (saveError) {
    // The analysis itself succeeded — surface it to the teacher even if
    // saving failed, but flag that it won't show up in history later.
    console.error("Failed to save analysis:", saveError.message);
    return NextResponse.json({ ...result, saved: false });
  }

  return NextResponse.json({ ...result, saved: true });
}
