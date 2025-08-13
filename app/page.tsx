import Link from "next/link";
import {
  GitMerge,
  Scissors,
  FileImage,
  Archive,
  Move,
  FileText,
  RefreshCw,
  Eraser,
} from "lucide-react";

// This data can be moved to a separate file later for better organization
const toolCategories = [
  {
    name: "PDF Tools",
    description: "Manipulate and convert your PDF files with ease.",
    tools: [
      { href: "/pdf/merge", label: "Merge PDFs", icon: GitMerge, description: "Combine multiple PDFs into one." },
      { href: "/pdf/split", label: "Split PDF", icon: Scissors, description: "Extract pages from a PDF." },
      { href: "/pdf/compress", label: "Compress PDF", icon: Archive, description: "Reduce the file size of your PDF." },
      { href: "/pdf/to-images", label: "PDF to Images", icon: FileImage, description: "Convert PDF pages to images." },
    ],
  },
  {
    name: "Image Tools",
    description: "Resize, convert, and edit your images in seconds.",
    tools: [
      { href: "/image/resize", label: "Resize Image", icon: Move, description: "Change the dimensions of your image." },
      { href: "/image/convert", label: "Convert Format", icon: RefreshCw, description: "Convert images to JPG, PNG, etc." },
      { href: "/image/compress", label: "Compress Image", icon: Archive, description: "Reduce image file size." },
      { href: "/image/to-pdf", label: "Images to PDF", icon: FileText, description: "Convert multiple images into a single PDF." },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="relative space-y-16 py-8 md:py-12">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative text-center animate-slide-up">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-bounce-subtle">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              100% Privacy-First Processing
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 gradient-text animate-slide-down">
            Your All-in-One File Processing Suite
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Transform, compress, and convert your files instantly. All processing happens in your browser—no uploads, no data collection, just pure performance.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/80 border border-border backdrop-blur-sm">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-muted-foreground font-medium">100% Private</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/80 border border-border backdrop-blur-sm">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-muted-foreground font-medium">No Upload Required</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-surface/80 border border-border backdrop-blur-sm">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-muted-foreground font-medium">Lightning Fast</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      {toolCategories.map((category, categoryIndex) => (
        <section key={category.name} className="relative max-w-7xl mx-auto animate-slide-up" style={{ animationDelay: `${0.6 + categoryIndex * 0.2}s` }}>
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
              {category.name}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.tools.map((tool, toolIndex) => (
              <Link
                href={tool.href}
                key={tool.href}
                className="group relative block p-6 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border hover:border-primary/30 transition-all duration-500 hover-lift animate-scale-in"
                style={{ animationDelay: `${0.8 + categoryIndex * 0.2 + toolIndex * 0.1}s` }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon container */}
                <div className="relative flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
                  <tool.icon className="relative h-7 w-7 text-primary group-hover:text-secondary transition-colors duration-300" />
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-lg font-semibold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {tool.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted transition-colors duration-300">
                    {tool.description}
                  </p>
                </div>
                
                {/* Hover indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}