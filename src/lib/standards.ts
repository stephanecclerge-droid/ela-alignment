export type Standard = {
  code: string;
  grade: 10;
  strand: "Writing" | "Reading" | "Language" | "Speaking & Listening";
  officialText: string;
  teacherBreakdown: string[];
  studentPlainLanguage: string;
  // false = wording was only cross-checked via search results, not a direct
  // fetch of the official page — flag it so nobody trusts it blindly.
  verified: boolean;
};

// Seed data: real standards, added one at a time as they're verified against
// NYS's own sources (NYLearns.org / NYSED). More standards get added here as
// the same shape — nothing about the page below needs to change to add more.
export const STANDARDS: Standard[] = [
  {
    code: "W.9-10.1.a",
    grade: 10,
    strand: "Writing",
    officialText:
      "Introduce precise claim(s), distinguish the claim(s) from alternate or opposing claims, and create an organization that establishes clear relationships among claim(s), counterclaims, reasons, and evidence.",
    teacherBreakdown: [
      "State the claim precisely — vague or overly broad claims don't meet this standard.",
      "Explicitly distinguish the claim from alternate or opposing claims, not just imply the difference.",
      "Organize the whole piece so the relationships between claim, counterclaims, reasons, and evidence are clear, not just present.",
    ],
    studentPlainLanguage:
      "Say exactly what you're arguing, make sure it's clearly different from the other side's argument, and organize your writing so a reader can see how your reasons and evidence connect back to your point.",
    verified: true,
  },
  {
    code: "W.9-10.1.b",
    grade: 10,
    strand: "Writing",
    officialText:
      "Develop claim(s) and counterclaims fairly, supplying evidence for each while pointing out the strengths and limitations of both in a manner that anticipates the audience's knowledge level and concerns.",
    teacherBreakdown: [
      "State a clear claim — not just present one side of the argument.",
      "Represent the counterclaim fairly and accurately, not as a strawman that's easy to knock down.",
      "Supply real evidence for both the claim and the counterclaim, not cherry-picked evidence for only one side.",
      "Explicitly analyze the strengths and limitations of both sides, not just describe them.",
      "Anticipate what the audience already knows or is likely to push back on, and address it directly.",
    ],
    studentPlainLanguage:
      "Explain your main point, and fairly explain the other side's point too — not just to knock it down, but to show you actually understand it. Then explain what's strong and what's weak about both sides, keeping in mind what your reader already knows or might disagree with.",
    verified: true,
  },
  {
    code: "9-10R1",
    grade: 10,
    strand: "Reading",
    officialText:
      "Cite strong and thorough textual evidence to support analysis of what the text says explicitly/implicitly and make logical inferences; develop questions for deeper understanding and for further exploration. (RI&RL)",
    teacherBreakdown: [
      "Evidence has to be strong and thorough — one quote isn't enough to actually support real analysis.",
      "Address both what the text says directly (explicit) and what it implies (implicit/inference).",
      "Inferences must be logical and traceable back to the text, not a guess.",
      "Go further than answering a prompt — generate real follow-up questions of your own.",
    ],
    studentPlainLanguage:
      "Back up your ideas with real quotes and details from the text — both what it says directly and what it's hinting at. Then ask your own questions about what you still want to understand better.",
    verified: true,
  },
  {
    code: "9-10R2",
    grade: 10,
    strand: "Reading",
    officialText:
      "Determine one or more themes or central ideas in a text and analyze its development, including how it emerges and is shaped and refined by specific details; objectively and accurately summarize a text. (RI&RL)",
    teacherBreakdown: [
      "Identify the central idea or theme — there can be more than one.",
      "Track how it develops across the text, not just state what it is at the end.",
      "Point to specific details that shape and refine it over time.",
      "Write an objective summary — no personal opinion or judgment mixed in.",
    ],
    studentPlainLanguage:
      "Figure out the main point (or points) the text is making, and explain how that point grows or changes as you keep reading. Then summarize the text fairly, without adding your own opinion.",
    verified: true,
  },
  {
    code: "9-10R5",
    grade: 10,
    strand: "Reading",
    officialText:
      "In literary texts, consider how varied aspects of structure create meaning and affect the reader. (RL) In informational texts, consider how author's intent influences particular sentences, paragraphs, or sections. (RI)",
    teacherBreakdown: [
      "For literature: look at structural choices (order of events, flashbacks, pacing) and how they affect the reader's experience.",
      "For informational text: connect specific paragraphs or sections back to the author's actual intent or purpose.",
      "Either way, the standard is about structure/organization mattering, not just content.",
    ],
    studentPlainLanguage:
      "Notice how a story is put together — the order things happen in, flashbacks, pacing — and how that affects you as a reader. For nonfiction, look at why the author organized specific paragraphs the way they did.",
    verified: false,
  },
];

export const STRANDS = [
  "Writing",
  "Reading",
  "Language",
  "Speaking & Listening",
] as const;
