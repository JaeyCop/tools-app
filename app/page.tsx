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
    <main className="relative space-y-24 py-12 md:py-20">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative text-center animate-slide-up">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <span className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-base font-semibold animate-bounce-subtle shadow-lg">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              100% Privacy-First Processing
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 gradient-text animate-slide-down">
            Your All-in-One File Processing Suite
          </h1>
          
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Transform, compress, and convert your files instantly and securely. All processing happens directly in your browser—no uploads, no data collection, just pure performance and peace of mind.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-base animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface/80 border border-border backdrop-blur-sm shadow-md transition-transform hover:scale-105">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-muted-foreground font-semibold">100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface/80 border border-border backdrop-blur-sm shadow-md transition-transform hover:scale-105">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-muted-foreground font-semibold">No File Uploads Required</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-surface/80 border border-border backdrop-blur-sm shadow-md transition-transform hover:scale-105">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-muted-foreground font-semibold">Lightning Fast Speeds</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      {toolCategories.map((category, categoryIndex) => (
        <section key={category.name} className="relative max-w-7xl mx-auto px-4 animate-slide-up" style={{ animationDelay: `${0.6 + categoryIndex * 0.2}s` }}>
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {category.name}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {category.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {category.tools.map((tool, toolIndex) => (
              <Link
                href={tool.href}
                key={tool.href}
                className="group relative block p-8 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border hover:border-primary/40 transition-all duration-300 hover-lift-glow animate-scale-in"
                style={{ animationDelay: `${0.8 + categoryIndex * 0.2 + toolIndex * 0.08}s` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                
                <div className="relative flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-glow" />
                  <tool.icon className="relative h-8 w-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {tool.label}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/90 transition-colors duration-300">
                    {tool.description}
                  </p>
                </div>
                
                <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-primary/50 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* How It Works Section */}
      <section className="relative max-w-7xl mx-auto px-4 text-center animate-slide-up" style={{ animationDelay: '1.2s' }}>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-12">How It Works in 3 Simple Steps</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-8 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shadow-lg">
            <h3 className="text-2xl font-bold mb-4">1. Select Your Tool</h3>
            <p className="text-muted-foreground">Choose from our wide range of PDF and image processing tools to get started.</p>
          </div>
          <div className="p-8 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shadow-lg">
            <h3 className="text-2xl font-bold mb-4">2. Process Your File</h3>
            <p className="text-muted-foreground">Drag and drop your file. All processing is done securely in your browser.</p>
          </div>
          <div className="p-8 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shadow-lg">
            <h3 className="text-2xl font-bold mb-4">3. Download & Go</h3>
            <p className="text-muted-foreground">Instantly download your processed file. No waiting, no hassle.</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative max-w-7xl mx-auto px-4 text-center animate-slide-up" style={{ animationDelay: '1.4s' }}>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-12">Why JaeyGuides Tools?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-8 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Ultimate Privacy</h3>
            <p className="text-muted-foreground">Your files are never uploaded to our servers. Everything stays on your device, ensuring 100% privacy.</p>
          </div>
          <div className="p-8 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Unmatched Speed</h3>
            <p className="text-muted-foreground">By processing files in your browser, we eliminate upload/download time, delivering results instantly.</p>
          </div>
          <div className="p-8 rounded-2xl bg-surface/80 border border-border backdrop-blur-sm shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Completely Free</h3>
            <p className="text-muted-foreground">All our tools are free to use with no hidden costs or registration required. Just powerful tools at your fingertips.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative max-w-5xl mx-auto px-4 text-center animate-slide-up" style={{ animationDelay: '1.6s' }}>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">About JaeyGuides</h2>
        <div className="text-xl text-muted-foreground leading-relaxed space-y-6">
          <p>JaeyGuides started as a passion project to create simple, powerful, and privacy-focused tools for everyday file-processing needs. We believe that you shouldn't have to compromise on privacy or pay fees for simple tasks. Our mission is to provide high-quality, browser-based utilities that are accessible to everyone, everywhere.</p>
          <p>We are committed to maintaining a user-centric approach, continuously improving our tools and adding new ones based on user feedback. Your trust is our top priority.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-center animate-slide-up" style={{ animationDelay: '1.8s' }}>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">Ready to Get Started?</h2>
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
          Pick a tool and experience the difference. Your files, your device, your privacy.
        </p>
        <Link href="#tools" className="inline-block px-10 py-5 text-xl font-semibold text-white bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-transform hover:scale-105">
          Explore All Tools
        </Link>
      </section>
    </main>
  );
}