export type Standard = {
  code: string;
  grade: 10;
  strand: "Writing" | "Reading" | "Language" | "Speaking & Listening";
  officialText: string;
  teacherBreakdown: string[];
  studentPlainLanguage: string;
};

// Seed data: one verified real standard to start (NYS Next Generation ELA,
// grade 9-10, Writing strand). More standards get added here as the same
// shape — nothing about the page below needs to change to add more.
export const STANDARDS: Standard[] = [
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
  },
];

export const STRANDS = [
  "Writing",
  "Reading",
  "Language",
  "Speaking & Listening",
] as const;
