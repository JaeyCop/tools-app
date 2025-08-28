import { Search, HelpCircle, Shield, Zap, FileText, Image, Users, Mail, ChevronDown } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Frequently Asked Questions - JaeyGuides",
  description: "Find answers to common questions about PDF and image processing, privacy, security, and using JaeyGuides tools effectively.",
  keywords: ["FAQ", "help", "PDF questions", "image processing help", "privacy", "security", "support"],
};

const faqCategories = [
  {
    title: "General Questions",
    icon: HelpCircle,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    questions: [
      {
        q: "What is JaeyGuides and what makes it different?",
        a: "JaeyGuides is a privacy-first suite of PDF and image processing tools that run entirely in your browser. Unlike other online tools, we never upload your files to servers - all processing happens locally on your device. This ensures complete privacy, faster processing, and no file size limits or usage restrictions."
      },
      {
        q: "Is JaeyGuides really free to use?",
        a: "Yes, absolutely! All our tools are completely free with no hidden costs, subscription fees, or premium tiers. We believe powerful document processing tools should be accessible to everyone. There are no limits on file sizes, number of files, or usage frequency."
      },
      {
        q: "Do I need to create an account or register?",
        a: "No registration required! You can use all our tools immediately without creating an account, providing personal information, or going through any signup process. Just visit the tool you need and start processing your files right away."
      },
      {
        q: "What browsers and devices are supported?",
        a: "Our tools work on all modern browsers including Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. They're fully responsive and work on desktop computers, laptops, tablets, and smartphones. For the best experience, we recommend using the latest version of your preferred browser."
      }
    ]
  },
  {
    title: "Privacy & Security",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    questions: [
      {
        q: "How can I be sure my files are private and secure?",
        a: "Your files never leave your device. All processing happens locally in your browser using WebAssembly and JavaScript. We don't have servers that store or process files, and we don't track what files you process. You can even use our tools offline once the page loads. For extra security, you can disconnect from the internet while processing sensitive documents."
      },
      {
        q: "Do you collect any data about my usage?",
        a: "We collect minimal, anonymous analytics to understand which tools are most popular and improve our service. We never collect information about your files, their contents, names, or any personal data. We don't use tracking cookies or third-party analytics that could compromise your privacy."
      },
      {
        q: "Can I use these tools for confidential business documents?",
        a: "Absolutely! Since all processing happens locally on your device, JaeyGuides is perfect for confidential business documents, legal files, medical records, and other sensitive materials. Many professionals and organizations use our tools specifically because of our privacy-first approach."
      },
      {
        q: "What happens to my files after processing?",
        a: "Your original files and processed results exist only in your browser's temporary memory and are automatically cleared when you close the tab or navigate away. Nothing is stored permanently on your device unless you explicitly download the results."
      }
    ]
  },
  {
    title: "PDF Tools",
    icon: FileText,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    questions: [
      {
        q: "What's the maximum file size for PDF processing?",
        a: "There are no artificial file size limits imposed by our service. The only limitation is your device's available memory (RAM). Most modern devices can handle PDFs up to several hundred megabytes. For very large files (1GB+), processing may be slower and depend on your device's capabilities."
      },
      {
        q: "Will PDF processing affect the quality of my documents?",
        a: "Our PDF tools preserve original quality by default. When merging or splitting PDFs, no quality loss occurs. For compression, you can choose your quality settings - we offer lossless compression that maintains perfect quality, or lossy compression with adjustable quality levels for smaller file sizes."
      },
      {
        q: "Can I merge password-protected PDFs?",
        a: "Currently, our tools work with unprotected PDFs. If you have password-protected PDFs, you'll need to remove the password protection first using other software, then use our tools to merge, split, or compress them."
      },
      {
        q: "Do your tools preserve PDF metadata and bookmarks?",
        a: "Yes, our tools preserve important PDF metadata including creation date, author information, and document properties. Bookmarks and table of contents are also maintained during merging and splitting operations, ensuring your document structure remains intact."
      },
      {
        q: "Can I merge PDFs with different page sizes or orientations?",
        a: "Yes! Our PDF merger handles documents with different page sizes (A4, Letter, Legal, etc.) and orientations (portrait/landscape). The merged PDF will preserve each page's original dimensions and orientation."
      }
    ]
  },
  {
    title: "Image Tools",
    icon: Image,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    questions: [
      {
        q: "What image formats do you support?",
        a: "We support all major image formats including JPEG, PNG, WebP, GIF, BMP, TIFF, and SVG. You can convert between most formats, with some limitations (for example, animated GIFs can be converted to static formats, but not the reverse)."
      },
      {
        q: "How does image compression work without losing quality?",
        a: "We offer both lossless and lossy compression options. Lossless compression reduces file size without any quality loss by optimizing how the image data is stored. Lossy compression (like JPEG) removes some visual information that's less noticeable to human eyes, allowing for much smaller file sizes with minimal visible quality loss."
      },
      {
        q: "Can I batch process multiple images at once?",
        a: "Yes! Most of our image tools support batch processing. You can upload multiple images and apply the same settings to all of them simultaneously. This is perfect for resizing a photo album, converting format for multiple images, or compressing many files at once."
      },
      {
        q: "Do you preserve EXIF data in processed images?",
        a: "By default, we preserve EXIF metadata (camera settings, GPS location, etc.) when processing images. However, you can choose to remove this data for privacy reasons, especially when sharing images online. This option is available in our compression and conversion tools."
      },
      {
        q: "What's the difference between resizing and compressing images?",
        a: "Resizing changes the physical dimensions (width and height) of an image, which reduces file size by having fewer pixels. Compression reduces file size by optimizing how the image data is stored, without changing dimensions. Often, combining both techniques gives the best results for web use."
      }
    ]
  },
  {
    title: "Technical Support",
    icon: Zap,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    questions: [
      {
        q: "Why is processing slow on my device?",
        a: "Processing speed depends on your device's CPU and available memory. Large files, older devices, or having many browser tabs open can slow processing. For better performance, close unnecessary tabs, ensure your device has sufficient free memory, and consider processing large files in smaller batches."
      },
      {
        q: "The tool isn't working - what should I try?",
        a: "First, try refreshing the page and clearing your browser cache. Ensure you're using a supported browser version. If problems persist, try using an incognito/private browsing window to rule out browser extensions. For persistent issues, contact us with details about your browser, device, and the specific problem."
      },
      {
        q: "Can I use these tools offline?",
        a: "Once a tool page loads, most functionality works offline since processing happens in your browser. However, you need an internet connection to initially load the page and access updates. For completely offline use, some browsers allow you to save pages for offline access."
      },
      {
        q: "Why do some features require modern browsers?",
        a: "Our tools use advanced web technologies like WebAssembly, modern JavaScript features, and sophisticated APIs for file handling. These technologies enable powerful, desktop-like functionality in your browser but require recent browser versions to work properly."
      },
      {
        q: "I found a bug or have a feature request - how can I report it?",
        a: "We welcome bug reports and feature suggestions! Please contact us through our contact page with detailed information about the issue or your idea. Include your browser version, device type, and steps to reproduce any problems. We actively use community feedback to improve our tools."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 shadow-lg">
              <HelpCircle className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground mb-6">
            Frequently Asked <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Questions</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about our PDF and image processing tools, privacy practices, and how to get the most out of JaeyGuides.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              className="w-full pl-12 pr-4 py-4 bg-surface/80 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Quick Navigation</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {faqCategories.map((category) => (
              <a
                key={category.title}
                href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-3 px-6 py-3 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300 hover:scale-105"
              >
                <category.icon className={`h-5 w-5 ${category.color}`} />
                <span className="font-medium text-foreground">{category.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category, categoryIndex) => (
          <section
            key={category.title}
            id={category.title.toLowerCase().replace(/\s+/g, '-')}
            className="mb-16 animate-slide-up"
            style={{ animationDelay: `${0.3 + categoryIndex * 0.1}s` }}
          >
            <div className={`${category.bgColor} ${category.borderColor} border rounded-2xl p-8`}>
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <h3 className="font-semibold text-foreground pr-4">{faq.q}</h3>
                      <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform duration-200 flex-shrink-0" />
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Still Need Help Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl border border-primary/20 p-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Still Need Help?</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help. 
            We typically respond to inquiries within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              Contact Support
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-3 bg-surface/80 border border-border text-foreground font-semibold py-4 px-8 rounded-xl hover:border-primary/40 transition-all duration-300"
            >
              <HelpCircle className="h-5 w-5" />
              Browse Guides
            </Link>
          </div>
        </section>

        {/* Popular Tools */}
        <section className="mt-16 animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Popular Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Merge PDFs", href: "/pdf/merge", description: "Combine multiple PDFs" },
              { name: "Compress PDF", href: "/pdf/compress", description: "Reduce PDF file size" },
              { name: "Resize Images", href: "/image/resize", description: "Change image dimensions" },
              { name: "Convert Images", href: "/image/convert", description: "Change image format" }
            ].map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group p-4 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300 text-center"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}