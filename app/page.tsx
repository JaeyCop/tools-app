import Link from "next/link";

function ToolCard(props: { title: string; description: string; href: string }) {
  const { title, description, href } = props;
  return (
    <Link
      href={href}
      className="block rounded-md border p-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm text-black/70 dark:text-white/60">{description}</div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          All‑in‑one PDF & Image tools
        </h1>
        <p className="text-sm text-black/70 dark:text-white/60">
          Process files in your browser. Nothing is uploaded.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/pdf/merge"
            className="rounded bg-black text-white dark:bg-white dark:text-black px-4 py-2"
          >
            PDF Merge
          </Link>
          <Link href="/image/resize" className="rounded border px-4 py-2">
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

      <section className="space-y-4">
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
  );
}
