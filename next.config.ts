import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (and its native @napi-rs/canvas dependency) needs to stay a
  // real Node require() at runtime, not get bundled by Next — bundling
  // breaks both its worker-file resolution and its native binary loading.
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  // pdf-parse resolves its pdf.worker.mjs file at runtime via a
  // dynamically-built path, so Vercel's build-time file tracer can't see the
  // reference on its own — this tells it to bundle the file anyway.
  outputFileTracingIncludes: {
    "/api/extract-text": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
};

export default nextConfig;
