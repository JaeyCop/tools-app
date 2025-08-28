import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertTriangle, Users, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "PDF Accessibility Best Practices | Complete Guide",
  description: "Learn how to create accessible PDFs that work for everyone, including users with disabilities. Comprehensive guide to WCAG compliance and inclusive document design.",
  keywords: ["PDF accessibility", "WCAG compliance", "inclusive design", "screen readers", "document accessibility"],
};

export default function PDFAccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Guides
        </Link>

        <article className="prose prose-lg max-w-none">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                Advanced
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              PDF Accessibility Best Practices
            </h1>
            <p className="text-xl text-muted-foreground">
              Create PDFs that work for everyone, including users with disabilities. Learn WCAG compliance and inclusive document design principles.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Eye className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Why PDF Accessibility Matters
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Over 1 billion people worldwide have disabilities. Making your PDFs accessible ensures everyone can access your content, improves SEO, and often fulfills legal requirements.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding PDF Accessibility</h2>
          
          <p className="text-muted-foreground mb-6">
            PDF accessibility involves creating documents that can be easily read and navigated by assistive technologies like screen readers, while also being usable by people with various disabilities including visual, auditory, motor, and cognitive impairments.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key Accessibility Principles</h3>
          
          <div className="grid gap-4 mb-8">
            {[
              {
                title: "Perceivable",
                description: "Information must be presentable in ways users can perceive, including alternative text for images and proper color contrast."
              },
              {
                title: "Operable",
                description: "Interface components must be operable, including keyboard navigation and sufficient time to read content."
              },
              {
                title: "Understandable",
                description: "Information and UI operation must be understandable, with clear language and predictable functionality."
              },
              {
                title: "Robust",
                description: "Content must be robust enough for interpretation by assistive technologies and various user agents."
              }
            ].map((principle, index) => (
              <div key={index} className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{principle.title}</h4>
                  <p className="text-muted-foreground">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Essential Accessibility Features</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Document Structure</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use proper heading hierarchy (H1, H2, H3) to create logical document structure</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Add bookmarks for easy navigation in longer documents</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use lists (ordered and unordered) instead of manual numbering</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Ensure reading order matches visual layout</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Alternative Text and Images</h3>
          
          <p className="text-muted-foreground mb-4">
            Every image, chart, or graphic element should have descriptive alternative text that conveys the same information as the visual element.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Alt Text Best Practices
                </h4>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-2">
                  <li>• Be concise but descriptive (aim for 125 characters or less)</li>
                  <li>• Describe the content and function, not just appearance</li>
                  <li>• Use empty alt text for decorative images</li>
                  <li>• For complex images, provide detailed descriptions in the document text</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Color and Contrast</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Ensure minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Don't rely solely on color to convey information</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use patterns, shapes, or text labels alongside color coding</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Steps</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">1. Start with Accessible Source Documents</h3>
          
          <p className="text-muted-foreground mb-4">
            The easiest way to create accessible PDFs is to start with accessible source documents in Word, InDesign, or other authoring tools.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">2. Use PDF Accessibility Tools</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Adobe Acrobat Pro's Accessibility Checker</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">PAC (PDF Accessibility Checker) - free tool</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Screen reader testing (NVDA, JAWS, VoiceOver)</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">3. Test and Validate</h3>
          
          <p className="text-muted-foreground mb-6">
            Regular testing with actual assistive technologies and users with disabilities is crucial for ensuring true accessibility.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Common Accessibility Issues</h2>

          <div className="space-y-4 mb-8">
            {[
              "Missing or inadequate alternative text for images",
              "Improper heading structure or missing headings",
              "Insufficient color contrast",
              "Inaccessible forms without proper labels",
              "Tables without proper headers and structure",
              "Documents that aren't keyboard navigable",
              "Missing document language specification"
            ].map((issue, index) => (
              <div key={index} className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <span className="text-red-800 dark:text-red-200">{issue}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Legal Requirements</h2>
          
          <p className="text-muted-foreground mb-4">
            Many jurisdictions have legal requirements for digital accessibility:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>ADA (Americans with Disabilities Act)</strong> - US federal law</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>Section 508</strong> - US federal agencies</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>AODA</strong> - Accessibility for Ontarians with Disabilities Act</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>EN 301 549</strong> - European accessibility standard</span>
            </li>
          </ul>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Quick Accessibility Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Document has proper title and language specified</li>
              <li>✓ Headings are used correctly and in logical order</li>
              <li>✓ All images have appropriate alternative text</li>
              <li>✓ Color contrast meets WCAG standards</li>
              <li>✓ Document is keyboard navigable</li>
              <li>✓ Forms have proper labels and instructions</li>
              <li>✓ Tables have headers and proper structure</li>
              <li>✓ Links have descriptive text</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Creating accessible PDFs is not just about compliance—it's about ensuring your content reaches the widest possible audience. By following these best practices and testing with real users, you can create documents that work for everyone.
          </p>

          <p className="text-muted-foreground">
            Remember that accessibility is an ongoing process, not a one-time fix. Regular testing, user feedback, and staying updated with accessibility guidelines will help you maintain and improve your document accessibility over time.
          </p>
        </article>
      </div>
    </div>
  );
}