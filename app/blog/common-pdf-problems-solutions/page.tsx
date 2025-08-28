import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, AlertTriangle, CheckCircle, FileText, Settings, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "10 Common PDF Problems and How to Fix Them | Complete Solutions Guide",
  description: "Solve the most frustrating PDF issues with our comprehensive troubleshooting guide. From corrupted files to formatting problems, we have the solutions.",
  keywords: ["PDF problems", "PDF issues", "PDF troubleshooting", "fix PDF", "PDF solutions", "PDF repair", "PDF not opening"],
};

export default function CommonPDFProblemsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="prose prose-lg max-w-none">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              10 Common PDF Problems and How to Fix Them
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>March 20, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>JaeyGuides Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>12 min read</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground">
              PDFs are everywhere in our digital world, but they're not without their problems. From files that won't open to formatting nightmares, PDF issues can be incredibly frustrating. Here's your complete guide to solving the most common PDF problems quickly and effectively.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Before You Start
                </h3>
                <p className="text-red-800 dark:text-red-200">
                  Always keep backup copies of important PDFs before attempting any fixes. Some solutions may modify the original file, and you'll want to preserve the original in case something goes wrong.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">1. PDF Won't Open or Displays Error Messages</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> You double-click a PDF file, but it won't open, shows an error message, or displays a blank screen.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Update your PDF reader</p>
                  <p className="text-muted-foreground text-sm">Outdated PDF readers often can't handle newer PDF formats. Update Adobe Reader, Chrome, or your preferred PDF viewer.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Try a different PDF reader</p>
                  <p className="text-muted-foreground text-sm">If Adobe Reader fails, try opening the file in Chrome, Firefox, or alternative readers like Foxit or Sumatra PDF.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Re-download the file</p>
                  <p className="text-muted-foreground text-sm">The file might be corrupted during download. Try downloading it again from the original source.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">2. PDF File Size is Too Large</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> Your PDF is too large to email, upload, or share, making it impractical for everyday use.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Use our PDF compression tool</p>
                  <p className="text-muted-foreground text-sm">Our <Link href="/pdf/compress" className="text-primary hover:underline">PDF compressor</Link> can reduce file sizes by 60-80% while maintaining quality.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Optimize images within the PDF</p>
                  <p className="text-muted-foreground text-sm">Large images are often the culprit. Reduce image resolution and quality for web sharing.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Remove unnecessary elements</p>
                  <p className="text-muted-foreground text-sm">Delete unused bookmarks, comments, form fields, and embedded fonts that aren't essential.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">3. Text is Blurry or Pixelated</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> Text appears fuzzy, pixelated, or difficult to read, especially when zooming in.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Check your zoom level</p>
                  <p className="text-muted-foreground text-sm">Sometimes the issue is simply viewing at an inappropriate zoom level. Try 100% or 125% zoom.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Enable font smoothing</p>
                  <p className="text-muted-foreground text-sm">In Adobe Reader, go to Edit &gt; Preferences &gt; Page Display and enable "Smooth text and monochrome images."</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Recreate from source</p>
                  <p className="text-muted-foreground text-sm">If possible, recreate the PDF from the original document with higher quality settings.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">4. PDF Pages Won't Print Correctly</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> Pages print with cut-off content, wrong orientation, or scaling issues.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Adjust print scaling</p>
                  <p className="text-muted-foreground text-sm">In print dialog, try "Fit to page," "Actual size," or "Shrink oversized pages" options.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Check page orientation</p>
                  <p className="text-muted-foreground text-sm">Ensure your printer settings match the PDF orientation (portrait vs. landscape).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Print as image</p>
                  <p className="text-muted-foreground text-sm">In advanced print options, select "Print as image" to bypass font and vector rendering issues.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">5. Can't Copy or Select Text</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> You can't select, copy, or search text within the PDF, making it difficult to extract information.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Check if it's a scanned document</p>
                  <p className="text-muted-foreground text-sm">Scanned PDFs are essentially images. You'll need OCR (Optical Character Recognition) to make text selectable.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Use OCR tools</p>
                  <p className="text-muted-foreground text-sm">Adobe Acrobat Pro, Google Drive, or online OCR tools can convert image-based text to selectable text.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Check security restrictions</p>
                  <p className="text-muted-foreground text-sm">The PDF might have copy protection enabled. Look for a lock icon in your PDF reader.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">6. PDF Forms Won't Save or Submit</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> You fill out a PDF form, but your entries disappear when you reopen the file, or the form won't submit.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Save with a new name</p>
                  <p className="text-muted-foreground text-sm">Use "Save As" instead of "Save" to create a new file with your form data preserved.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Use Adobe Reader</p>
                  <p className="text-muted-foreground text-sm">Some forms only work properly in Adobe Reader. Avoid browser PDF viewers for complex forms.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Check form permissions</p>
                  <p className="text-muted-foreground text-sm">The form might not allow saving. Try printing to PDF to preserve your entries.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">7. Password-Protected PDF Won't Open</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> You have the password, but the PDF still won't open, or you've forgotten the password entirely.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Check password accuracy</p>
                  <p className="text-muted-foreground text-sm">Passwords are case-sensitive. Try typing in a text editor first to verify, then copy-paste.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Contact the sender</p>
                  <p className="text-muted-foreground text-sm">If you received the PDF from someone else, they might have the password or can send an unprotected version.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Password recovery tools</p>
                  <p className="text-muted-foreground text-sm">Only use these for PDFs you own. Password cracking may violate terms of service or laws.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">8. PDF Displays Incorrectly on Mobile Devices</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> PDFs look fine on desktop but are difficult to read or navigate on smartphones and tablets.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Use mobile-friendly PDF readers</p>
                  <p className="text-muted-foreground text-sm">Adobe Acrobat Reader mobile app offers better mobile viewing than browser PDF viewers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Enable reflow mode</p>
                  <p className="text-muted-foreground text-sm">Many mobile PDF readers have a "reflow" or "liquid mode" that reformats text for smaller screens.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Convert to mobile-friendly format</p>
                  <p className="text-muted-foreground text-sm">Consider converting to images or creating a mobile-optimized version of the PDF.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">9. PDF Loading is Extremely Slow</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> PDFs take forever to load, especially large documents or those with many images.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Compress the PDF</p>
                  <p className="text-muted-foreground text-sm">Use our <Link href="/pdf/compress" className="text-primary hover:underline">PDF compression tool</Link> to reduce file size and improve loading speed.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Enable fast web view</p>
                  <p className="text-muted-foreground text-sm">When creating PDFs, enable "Fast Web View" to allow page-by-page loading instead of downloading the entire file.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Split large PDFs</p>
                  <p className="text-muted-foreground text-sm">Use our <Link href="/pdf/split" className="text-primary hover:underline">PDF splitter</Link> to break large documents into smaller, faster-loading sections.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">10. PDF Compatibility Issues Between Different Readers</h2>

          <p className="text-muted-foreground mb-4">
            <strong>The Problem:</strong> A PDF looks different or has missing elements when opened in different PDF readers or browsers.
          </p>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Solutions:</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Use standard fonts</p>
                  <p className="text-muted-foreground text-sm">Stick to common fonts like Arial, Times New Roman, or embed fonts in the PDF to ensure consistency.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Save as PDF/A</p>
                  <p className="text-muted-foreground text-sm">PDF/A format ensures long-term compatibility and consistent rendering across different readers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Test across multiple readers</p>
                  <p className="text-muted-foreground text-sm">Before distributing, test your PDF in Adobe Reader, Chrome, Firefox, and mobile apps.</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Prevention Tips</h2>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Avoid Future PDF Problems
            </h4>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>• Always keep backup copies of important PDFs</li>
              <li>• Use reputable PDF creation software</li>
              <li>• Regularly update your PDF reader software</li>
              <li>• Test PDFs before sharing them widely</li>
              <li>• Use standard fonts and avoid complex layouts when possible</li>
              <li>• Optimize images before adding them to PDFs</li>
              <li>• Consider your audience's likely PDF readers when creating documents</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">When to Seek Professional Help</h2>

          <p className="text-muted-foreground mb-4">
            If you've tried these solutions and still can't resolve your PDF issues, it might be time to:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Contact the document creator for a new copy or different format</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use professional PDF repair software for severely corrupted files</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Consult with IT support if the issues are widespread in your organization</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>

          <p className="text-muted-foreground mb-6">
            PDF problems can be frustrating, but most issues have straightforward solutions. The key is identifying the root cause and applying the appropriate fix. Remember that prevention is often easier than cure—creating PDFs with compatibility and accessibility in mind from the start will save you time and headaches later.
          </p>

          <p className="text-muted-foreground mb-6">
            Our PDF tools at JaeyGuides are designed to help you avoid many of these common problems. Whether you need to compress large files, split unwieldy documents, or merge multiple PDFs, our browser-based tools process everything locally for maximum privacy and convenience.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Need More Help?
            </h4>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              If you're still experiencing PDF issues after trying these solutions, don't hesitate to reach out. Our team is here to help you get your documents working properly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              Contact Support
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}