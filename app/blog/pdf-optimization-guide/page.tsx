import { Calendar, Clock, User, Share2, BookOpen, Lightbulb, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "The Complete Guide to PDF Optimization: Reduce File Size Without Losing Quality",
  description: "Learn professional techniques to compress PDFs effectively while maintaining document quality. Discover the science behind PDF compression and when to use different methods.",
  keywords: ["PDF optimization", "PDF compression", "reduce PDF size", "PDF quality", "document optimization"],
};

export default function PdfOptimizationGuide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Article Header */}
        <header className="mb-12 animate-slide-up">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span>PDF Processing</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            The Complete Guide to PDF Optimization: Reduce File Size Without Losing Quality
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 15, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>8 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>JaeyGuides Team</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 font-medium">
              PDF Processing
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface/80 border border-border rounded-full hover:border-primary/40 transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Introduction */}
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-8 mb-12">
            <div className="flex items-start gap-4">
              <BookOpen className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 mt-0">What You'll Learn</h2>
                <p className="text-muted-foreground mb-4">
                  PDF optimization is both an art and a science. In this comprehensive guide, you'll discover professional techniques used by document specialists to dramatically reduce PDF file sizes while maintaining visual quality and functionality.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Understanding PDF structure and compression algorithms</li>
                  <li>Choosing the right optimization settings for different document types</li>
                  <li>Advanced techniques for image-heavy documents</li>
                  <li>Maintaining accessibility and searchability</li>
                  <li>Quality control and testing strategies</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Understanding PDF Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Understanding PDF Structure</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Before diving into optimization techniques, it's crucial to understand what makes up a PDF file. PDFs are complex documents that can contain various elements, each contributing to the overall file size in different ways.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Text Content</h3>
                <p className="text-muted-foreground mb-4">
                  Text is typically the most efficient content type in PDFs. However, embedded fonts and complex formatting can increase file size significantly.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Font embedding strategies</li>
                  <li>Unicode considerations</li>
                  <li>Text compression algorithms</li>
                </ul>
              </div>
              
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Images & Graphics</h3>
                <p className="text-muted-foreground mb-4">
                  Images often account for 80-90% of a PDF's file size. Understanding image compression is key to effective optimization.
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>JPEG vs PNG compression</li>
                  <li>Resolution and DPI considerations</li>
                  <li>Color space optimization</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Pro Tip</h4>
                  <p className="text-amber-700 dark:text-amber-300">
                    Use PDF analysis tools to identify which elements contribute most to your file size. This data-driven approach ensures you focus optimization efforts where they'll have the biggest impact.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Compression Techniques */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Compression Techniques Explained</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              PDF optimization employs various compression algorithms, each suited for different types of content. Understanding these techniques helps you make informed decisions about quality vs. file size trade-offs.
            </p>

            <div className="space-y-8">
              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">1. Lossless Compression</h3>
                <p className="text-muted-foreground mb-4">
                  Lossless compression reduces file size without any quality degradation. It's ideal for text-heavy documents and images with sharp edges or transparency.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Best For:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Text documents</li>
                      <li>Line art and diagrams</li>
                      <li>Screenshots with text</li>
                      <li>Documents requiring perfect fidelity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Typical Reduction:</h4>
                    <p className="text-muted-foreground">10-30% file size reduction</p>
                    <h4 className="font-semibold text-foreground mb-2 mt-4">Algorithms Used:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Flate/Deflate</li>
                      <li>LZW compression</li>
                      <li>CCITT (for monochrome images)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">2. Lossy Compression</h3>
                <p className="text-muted-foreground mb-4">
                  Lossy compression achieves significant file size reductions by removing information that's less perceptible to the human eye. Requires careful quality control.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Best For:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>Photographic images</li>
                      <li>Marketing materials</li>
                      <li>Web distribution</li>
                      <li>Large image collections</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Typical Reduction:</h4>
                    <p className="text-muted-foreground">50-90% file size reduction</p>
                    <h4 className="font-semibold text-foreground mb-2 mt-4">Quality Settings:</h4>
                    <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                      <li>High: 85-95% quality</li>
                      <li>Medium: 70-85% quality</li>
                      <li>Low: 50-70% quality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Optimization Strategies */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Document-Specific Optimization Strategies</h2>
            
            <div className="space-y-8">
              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">📄 Text-Heavy Documents</h3>
                <p className="text-muted-foreground mb-6">
                  For documents primarily containing text, focus on font optimization and structural compression.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Subset Embedded Fonts</h4>
                      <p className="text-muted-foreground">Only embed the characters actually used in the document, reducing font file overhead by 70-90%.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Optimize Object Streams</h4>
                      <p className="text-muted-foreground">Compress PDF objects into streams for better compression ratios on repeated elements.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Remove Unused Resources</h4>
                      <p className="text-muted-foreground">Clean up unused fonts, color profiles, and metadata that accumulate during document creation.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">🖼️ Image-Heavy Documents</h3>
                <p className="text-muted-foreground mb-6">
                  When images dominate your PDF, sophisticated image optimization becomes critical.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Resolution Optimization</h4>
                      <p className="text-muted-foreground">Downsample images to appropriate DPI: 150 DPI for print, 72-96 DPI for screen viewing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Smart Format Selection</h4>
                      <p className="text-muted-foreground">Use JPEG for photos, PNG for graphics with transparency, and monochrome compression for black-and-white images.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Color Space Conversion</h4>
                      <p className="text-muted-foreground">Convert RGB to CMYK only when necessary, and consider grayscale conversion for non-color-critical images.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quality Control */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Quality Control and Testing</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Optimization without quality control can result in unusable documents. Implement these testing strategies to ensure your optimized PDFs meet requirements.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Critical Warning</h4>
                  <p className="text-red-700 dark:text-red-300">
                    Always test optimized PDFs on target devices and applications before distribution. What looks acceptable on a high-resolution monitor may be illegible on mobile devices or when printed.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Visual Quality Checks</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Text readability at various zoom levels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Image clarity and color accuracy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Print quality assessment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Mobile device compatibility</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Functional Testing</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Hyperlink functionality</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Search and copy capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Accessibility features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Form field integrity</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Try Our Tool */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Optimize Your PDFs?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Put these techniques into practice with our free PDF compression tool. All processing happens in your browser for complete privacy.
              </p>
              <Link
                href="/pdf/compress"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
              >
                Try PDF Compressor
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Conclusion</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              PDF optimization is a powerful skill that can dramatically improve document distribution, storage costs, and user experience. By understanding the underlying technology and applying the right techniques for your specific use case, you can achieve significant file size reductions while maintaining the quality your audience expects.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Remember that optimization is an iterative process. Start with conservative settings, test thoroughly, and gradually increase compression levels until you find the perfect balance between file size and quality for your specific needs.
            </p>
          </section>
        </div>

        {/* Related Articles */}
        <footer className="mt-16 pt-8 border-t border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/image-formats-explained" className="group p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Image Formats Explained: JPEG vs PNG vs WebP
              </h4>
              <p className="text-muted-foreground text-sm">
                Learn when to use each image format for optimal file size and quality.
              </p>
            </Link>
            
            <Link href="/blog/pdf-accessibility-best-practices" className="group p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Creating Accessible PDFs: A Complete Guide
              </h4>
              <p className="text-muted-foreground text-sm">
                Ensure your optimized PDFs remain accessible to all users.
              </p>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}