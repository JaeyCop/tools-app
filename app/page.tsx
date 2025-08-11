import Link from "next/link";

function ToolCard(props: { title: string; description: string; href: string }) {
  const { title, description, href } = props;
  return (
    <Link
      href={href}
      className="block rounded-md border border-accent p-4 hover:bg-accent/10 transition-colors"
    >
      <div className="font-medium text-primary">{title}</div>
      <div className="text-sm text-foreground/70">{description}</div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="max-w-full min-h-[100dvh]">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-12">
        <section className="text-center space-y-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
            All‑in‑one PDF & Image tools
          </h1>
          <p className="text-base text-foreground/70">
            Fast, private, and free. Everything runs in your browser.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/pdf/merge"
              className="rounded-2xl bg-primary px-5 py-3 text-white font-semibold shadow hover:shadow-lg transition-shadow"
            >
              PDF Merge
            </Link>
            <Link href="/image/resize" className="rounded-2xl border border-secondary px-5 py-3 text-secondary hover:bg-secondary/10">
              Image Resize
            </Link>
          </div>
        </section>

        <section className="space-y-4">
        <h2 className="text-xl font-semibold">PDF Tools</h2>
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

        <section className="space-y-4 pb-4">
        <h2 className="text-xl font-semibold">Image Tools</h2>
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
