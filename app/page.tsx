import Link from "next/link";

function ToolCard(props: { title: string; description: string; href: string }) {
  const { title, description, href } = props;
  return (
    <Link
      href={href}
      className="block rounded-xl border border-border bg-surface p-6 hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 shadow-premium hover:shadow-premium-lg group"
    >
      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</div>
      <div className="text-sm text-muted mt-1">{description}</div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">
        <section className="text-center space-y-5">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            All‑in‑one PDF & Image tools
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Fast, private, and free. Everything runs in your browser.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/pdf/merge"
              className="gradient-primary rounded-2xl px-8 py-4 text-white font-semibold shadow-premium hover:shadow-premium-lg transition-all duration-200 hover:scale-105"
            >
              PDF Merge
            </Link>
            <Link 
              href="/image/resize" 
              className="rounded-2xl border-2 border-secondary px-8 py-4 text-secondary font-semibold hover:bg-secondary hover:text-white transition-all duration-200 hover:scale-105 shadow-premium"
            >
              Image Resize
            </Link>
          </div>
        </section>

        <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          PDF Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ToolCard
            title="Merge PDFs"
            description="Combine multiple PDFs into one."
            href="/pdf/merge"
          />
          <ToolCard
            title="Split PDF"
            description="Extract selected pages into separate PDFs."
            href="/pdf/split"
          />
          <ToolCard
            title="PDF to Images"
            description="Convert PDF pages to PNG and zip."
            href="/pdf/to-images"
          />
          <ToolCard
            title="Compress PDF"
            description="Reduce PDF size (best‑effort)."
            href="/pdf/compress"
          />
        </div>
        </section>

        <section className="space-y-6 pb-4">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-accent">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          Image Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <ToolCard
            title="Resize Image"
            description="Resize while keeping aspect ratio."
            href="/image/resize"
          />
          <ToolCard
            title="Images to PDF"
            description="Combine multiple images into a single PDF."
            href="/image/to-pdf"
          />
          <ToolCard
            title="Convert Image"
            description="JPG ↔ PNG ↔ WebP with quality."
            href="/image/convert"
          />
          <ToolCard
            title="Compress Image"
            description="Reduce file size with quality and max dimensions."
            href="/image/compress"
          />
          <ToolCard
            title="Remove Background"
            description="Make background transparent by color pick."
            href="/image/remove-bg"
          />
        </div>
        </section>
      </div>
    </div>
  );
}
