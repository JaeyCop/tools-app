import { Calendar, Clock, User, Share2, BookOpen, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, Eye, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Creating Accessible PDFs: A Complete Guide for Better Document Design",
  description: "Learn how to create PDFs that are accessible to users with disabilities. Understand WCAG guidelines and implement best practices for inclusive document design.",
  keywords: ["PDF accessibility", "WCAG guidelines", "accessible documents", "inclusive design", "screen readers", "disability compliance"],
};

export default function PdfAccessibilityGuide() {
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
            <span>Accessibility</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Creating Accessible PDFs: A Complete Guide for Better Document Design
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 10, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>10 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>JaeyGuides Team</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full border border-orange-200 dark:border-orange-800 font-medium">
              Accessibility
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
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-8 mb-12">
            <div className="flex items-start gap-4">
              <Eye className="h-8 w-8 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 mt-0">Why PDF Accessibility Matters</h2>
                <p className="text-muted-foreground mb-4">
                  Over 1 billion people worldwide live with disabilities, and many rely on assistive technologies to access digital content. Creating accessible PDFs isn't just about compliance—it's about ensuring your content reaches everyone who needs it.
                </p>
                <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
                  <h3 className="font-semibold text-foreground mb-2">Key Statistics:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 15% of the global population has some form of disability</li>
                    <li>• 285 million people are visually impaired worldwide</li>
                    <li>• Accessible design benefits everyone, not just users with disabilities</li>
                    <li>• Legal requirements exist in many jurisdictions (ADA, Section 508, AODA)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Understanding WCAG */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Understanding WCAG Guidelines for PDFs</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The Web Content Accessibility Guidelines (WCAG) 2.1 provide the foundation for PDF accessibility. These guidelines are organized around four key principles, often remembered by the acronym POUR.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">P</div>
                  Perceivable
                </h3>
                <p className="text-muted-foreground mb-4">Information must be presentable in ways users can perceive.</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide text alternatives for images</li>
                  <li>• Ensure sufficient color contrast</li>
                  <li>• Make content adaptable to different presentations</li>
                  <li>• Use meaningful headings and structure</li>
                </ul>
              </div>
              
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">O</div>
                  Operable
                </h3>
                <p className="text-muted-foreground mb-4">Interface components must be operable by all users.</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Make all functionality keyboard accessible</li>
                  <li>• Provide users enough time to read content</li>
                  <li>• Don't use content that causes seizures</li>
                  <li>• Help users navigate and find content</li>
                </ul>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">U</div>
                  Understandable
                </h3>
                <p className="text-muted-foreground mb-4">Information and UI operation must be understandable.</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Make text readable and understandable</li>
                  <li>• Make content appear and operate predictably</li>
                  <li>• Help users avoid and correct mistakes</li>
                  <li>• Use clear and simple language</li>
                </ul>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">R</div>
                  Robust
                </h3>
                <p className="text-muted-foreground mb-4">Content must be robust enough for various assistive technologies.</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use valid, semantic markup</li>
                  <li>• Ensure compatibility with screen readers</li>
                  <li>• Follow PDF/UA standards</li>
                  <li>• Test with assistive technologies</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Document Structure */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Building Accessible Document Structure</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The foundation of an accessible PDF is proper document structure. This invisible framework allows assistive technologies to understand and navigate your content effectively.
            </p>

            <div className="space-y-8">
              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">1. Logical Heading Hierarchy</h3>
                <p className="text-muted-foreground mb-6">
                  Headings provide a roadmap for your document. Screen reader users often navigate by jumping between headings, so proper hierarchy is crucial.
                </p>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3">✅ Good Heading Structure</h4>
                  <div className="font-mono text-sm text-green-700 dark:text-green-300 space-y-1">
                    <div>H1: Document Title</div>
                    <div className="ml-4">H2: Chapter 1</div>
                    <div className="ml-8">H3: Section 1.1</div>
                    <div className="ml-8">H3: Section 1.2</div>
                    <div className="ml-12">H4: Subsection 1.2.1</div>
                    <div className="ml-4">H2: Chapter 2</div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3">❌ Poor Heading Structure</h4>
                  <div className="font-mono text-sm text-red-700 dark:text-red-300 space-y-1">
                    <div>H1: Document Title</div>
                    <div className="ml-4">H3: Chapter 1 (skipped H2)</div>
                    <div className="ml-8">H2: Section 1.1 (wrong level)</div>
                    <div className="ml-4">H1: Chapter 2 (multiple H1s)</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">2. Alternative Text for Images</h3>
                <p className="text-muted-foreground mb-6">
                  Every meaningful image needs descriptive alternative text. Decorative images should be marked as such to avoid cluttering screen reader output.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">✅ Good Alt Text</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      "Bar chart showing 40% increase in PDF accessibility compliance from 2020 to 2023"
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">❌ Poor Alt Text</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      "Chart" or "Image1.jpg"
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">3. Table Structure and Headers</h3>
                <p className="text-muted-foreground mb-6">
                  Tables need proper header associations so screen readers can announce the context of each cell.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Use proper table headers</h4>
                      <p className="text-muted-foreground text-sm">Mark the first row and/or column as headers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Provide table summaries</h4>
                      <p className="text-muted-foreground text-sm">Include a caption or summary for complex tables</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">Avoid merged cells when possible</h4>
                      <p className="text-muted-foreground text-sm">Complex table structures can confuse screen readers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Color and Contrast */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Color and Contrast Requirements</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Color accessibility ensures your content is readable by users with various visual impairments, including color blindness and low vision.
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">WCAG Contrast Requirements</h4>
                  <ul className="text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• <strong>Normal text:</strong> 4.5:1 contrast ratio minimum</li>
                    <li>• <strong>Large text (18pt+ or 14pt+ bold):</strong> 3:1 contrast ratio minimum</li>
                    <li>• <strong>AAA level:</strong> 7:1 for normal text, 4.5:1 for large text</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Best Practices</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Don't rely on color alone to convey information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Use patterns, shapes, or text in addition to color</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Test your documents with color blindness simulators</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Ensure sufficient contrast for all text elements</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground">Testing Tools</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">WebAIM Contrast Checker</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Colour Contrast Analyser (CCA)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Adobe Acrobat Accessibility Checker</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">Sim Daltonism (color blindness simulator)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Testing and Validation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Testing and Validation</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Creating accessible PDFs is only half the battle—you need to test them thoroughly to ensure they work with assistive technologies.
            </p>

            <div className="space-y-6">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Automated Testing Tools</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Adobe Acrobat Pro</h4>
                    <p className="text-sm text-muted-foreground mb-3">Built-in accessibility checker with detailed reports</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Full accessibility audit</li>
                      <li>• Automatic tagging suggestions</li>
                      <li>• Reading order verification</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">PAC (PDF Accessibility Checker)</h4>
                    <p className="text-sm text-muted-foreground mb-3">Free tool for comprehensive PDF/UA validation</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• PDF/UA compliance checking</li>
                      <li>• Screen reader preview</li>
                      <li>• Detailed error reporting</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Manual Testing Checklist</h3>
                <div className="space-y-3">
                  {[
                    "Navigate the document using only the keyboard",
                    "Test with a screen reader (NVDA, JAWS, or VoiceOver)",
                    "Verify heading navigation works properly",
                    "Check that all images have appropriate alt text",
                    "Ensure tables are properly structured and labeled",
                    "Test form fields for proper labeling and functionality",
                    "Verify reading order is logical and sequential",
                    "Check color contrast meets WCAG requirements"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 border-2 border-primary rounded mt-0.5 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Try Our Tool */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Create Accessible PDFs</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Start with properly structured source documents and use our PDF tools to maintain accessibility while processing your files.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/pdf/merge"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Merge PDFs
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pdf/split"
                  className="inline-flex items-center gap-3 bg-surface/80 border border-border text-foreground font-semibold py-3 px-6 rounded-xl hover:border-primary/40 transition-all duration-300"
                >
                  Split PDFs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Building an Inclusive Future</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Creating accessible PDFs is an investment in inclusivity that benefits everyone. While it requires attention to detail and proper planning, the impact on users who rely on assistive technologies is immeasurable. By following these guidelines and making accessibility a priority from the start, you're helping create a more inclusive digital world.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Remember that accessibility is not a one-time checklist but an ongoing commitment. As technology evolves and standards improve, continue learning and adapting your practices to ensure your content remains accessible to all users.
            </p>
          </section>
        </div>

        {/* Related Articles */}
        <footer className="mt-16 pt-8 border-t border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/pdf-optimization-guide" className="group p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                The Complete Guide to PDF Optimization
              </h4>
              <p className="text-muted-foreground text-sm">
                Learn how to reduce PDF file sizes while maintaining accessibility features.
              </p>
            </Link>
            
            <Link href="/blog/digital-document-security" className="group p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Digital Document Security Fundamentals
              </h4>
              <p className="text-muted-foreground text-sm">
                Protect sensitive documents while maintaining accessibility compliance.
              </p>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}