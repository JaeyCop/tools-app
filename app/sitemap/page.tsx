import { Metadata } from "next";
import Link from "next/link";
import { Globe, FileText, Image, BookOpen, MessageSquare, Info, Shield, Scale, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Complete sitemap of JaeyGuides - find all our PDF tools, image tools, guides, and resources in one place.",
};

export default function SitemapPage() {
  const siteStructure = [
    {
      category: "Main Pages",
      icon: Globe,
      links: [
        { href: "/", title: "Home", description: "Main dashboard and tool overview" },
        { href: "/about", title: "About Us", description: "Learn about JaeyGuides and our mission" },
        { href: "/contact", title: "Contact", description: "Get in touch with our team" },
        { href: "/faq", title: "FAQ", description: "Frequently asked questions" },
      ]
    },
    {
      category: "PDF Tools",
      icon: FileText,
      links: [
        { href: "/pdf/merge", title: "Merge PDFs", description: "Combine multiple PDF files into one" },
        { href: "/pdf/split", title: "Split PDF", description: "Extract pages from PDF documents" },
        { href: "/pdf/compress", title: "Compress PDF", description: "Reduce PDF file size while maintaining quality" },
        { href: "/pdf/to-images", title: "PDF to Images", description: "Convert PDF pages to image formats" },
      ]
    },
    {
      category: "Image Tools", 
      icon: Image,
      links: [
        { href: "/image/resize", title: "Resize Images", description: "Change image dimensions and resolution" },
        { href: "/image/convert", title: "Convert Images", description: "Convert between different image formats" },
        { href: "/image/compress", title: "Compress Images", description: "Optimize images for web and storage" },
        { href: "/image/to-pdf", title: "Images to PDF", description: "Convert multiple images into PDF document" },
      ]
    },
    {
      category: "Guides & Tutorials",
      icon: BookOpen,
      links: [
        { href: "/guides", title: "All Guides", description: "Complete collection of tutorials and guides" },
        { href: "/guides/pdf-accessibility", title: "PDF Accessibility", description: "Creating accessible PDF documents" },
        { href: "/guides/batch-pdf-processing", title: "Batch Processing", description: "Efficient workflows for multiple files" },
        { href: "/guides/pdf-security", title: "PDF Security", description: "Protecting your PDF documents" },
        { href: "/guides/image-compression-advanced", title: "Advanced Compression", description: "Professional image optimization techniques" },
        { href: "/guides/color-management", title: "Color Management", description: "Digital color accuracy and consistency" },
        { href: "/guides/web-image-optimization", title: "Web Optimization", description: "Optimizing images for web performance" },
        { href: "/guides/document-workflows", title: "Document Workflows", description: "Streamlining document processes" },
        { href: "/guides/quality-control", title: "Quality Control", description: "Ensuring document quality standards" },
        { href: "/guides/file-organization", title: "File Organization", description: "Digital file management strategies" },
        { href: "/guides/document-security", title: "Document Security", description: "Comprehensive document protection" },
        { href: "/guides/privacy-first-processing", title: "Privacy-First Processing", description: "Privacy-focused document handling" },
        { href: "/guides/gdpr-compliance", title: "GDPR Compliance", description: "Legal compliance for document processing" },
      ]
    },
    {
      category: "Blog & Resources",
      icon: MessageSquare,
      links: [
        { href: "/blog", title: "Blog Home", description: "Latest articles and insights" },
        { href: "/blog/pdf-optimization-guide", title: "PDF Optimization Guide", description: "Complete guide to PDF compression" },
        { href: "/blog/image-formats-explained", title: "Image Formats Explained", description: "JPEG vs PNG vs WebP comparison" },
        { href: "/blog/pdf-accessibility-best-practices", title: "PDF Accessibility", description: "Creating accessible documents" },
        { href: "/blog/batch-processing-workflows", title: "Batch Processing", description: "Efficient document workflows" },
        { href: "/blog/digital-document-security", title: "Document Security", description: "Protecting digital documents" },
        { href: "/blog/image-compression-algorithms", title: "Compression Algorithms", description: "Understanding image compression" },
      ]
    },
    {
      category: "Legal & Support",
      icon: Info,
      links: [
        { href: "/privacy", title: "Privacy Policy", description: "How we protect your privacy" },
        { href: "/terms", title: "Terms of Service", description: "Terms and conditions of use" },
        { href: "/disclaimer", title: "Disclaimer", description: "Important usage disclaimers" },
        { href: "/sitemap", title: "Sitemap", description: "Complete site navigation" },
      ]
    },
    {
      category: "Advanced Features",
      icon: Shield,
      links: [
        { href: "/workflow", title: "Workflow Builder", description: "Create custom document processing workflows" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Sitemap</h1>
              <p className="text-muted-foreground mt-2">Complete navigation of all JaeyGuides pages and tools</p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {siteStructure.map((section, index) => (
            <div key={section.category} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{section.category}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group p-4 rounded-xl border border-border hover:border-primary/40 transition-all duration-300 hover:bg-surface/50 hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 0.1 + linkIndex * 0.05}s` }}
                    >
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {link.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {link.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you can't find a specific page or tool, please let us know. We're constantly adding new features and content to help you with your document processing needs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Mail className="h-4 w-4" />
            Contact Us
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}