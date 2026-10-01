import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse resolves its pdf.worker.mjs file at runtime via a
  // dynamically-built path, so Vercel's build-time file tracer can't see the
  // reference on its own — this tells it to bundle the file anyway.
  outputFileTracingIncludes: {
    "/api/extract-text": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
};

export default nextConfig;
