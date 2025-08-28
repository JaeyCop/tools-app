import { Metadata } from "next";
import { AlertTriangle, Shield, Info, FileText, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers and limitations regarding the use of JaeyGuides tools and services.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
              <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Disclaimer</h1>
              <p className="text-muted-foreground mt-2">Important information about our services</p>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Please Read Carefully
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200">
                  This disclaimer outlines important limitations and responsibilities regarding the use of JaeyGuides tools and services. By using our website, you acknowledge and agree to these terms.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">General Information</h2>
          
          <p className="text-muted-foreground mb-6">
            The information and tools provided on JaeyGuides.com are for general informational and utility purposes only. While we strive to provide accurate and up-to-date information, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Tool Usage and File Processing</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
              <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">File Processing Accuracy</h4>
                <p className="text-muted-foreground">
                  While our tools are designed to process files accurately, we cannot guarantee perfect results in all cases. Users should verify the output quality and accuracy before using processed files for important purposes.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
              <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">Data Security</h4>
                <p className="text-muted-foreground">
                  Our tools process files locally in your browser for privacy. However, users are responsible for ensuring they have appropriate backups of important files before processing.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
          
          <p className="text-muted-foreground mb-6">
            In no event will JaeyGuides, its owners, employees, or affiliates be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
              <span className="text-muted-foreground">Loss of data or corrupted files during processing</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
              <span className="text-muted-foreground">Interruption of business or services</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
              <span className="text-muted-foreground">Any errors, omissions, or inaccuracies in the content</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0" />
              <span className="text-muted-foreground">Any decision made or action taken in reliance on the information provided</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Links and Services</h2>
          
          <p className="text-muted-foreground mb-6">
            Our website may contain links to third-party websites or services. We have no control over the content, privacy policies, or practices of these third-party sites and assume no responsibility for them. We encourage you to review the terms and privacy policies of any third-party sites you visit.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Professional Advice</h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Not Professional Advice
            </h4>
            <p className="text-blue-800 dark:text-blue-200">
              The information provided on this website is not intended as professional, legal, technical, or business advice. Users should consult with qualified professionals for specific advice related to their particular circumstances.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Browser Compatibility and Technical Requirements</h2>
          
          <p className="text-muted-foreground mb-6">
            Our tools are designed to work with modern web browsers. We cannot guarantee compatibility with all browsers or devices. Users are responsible for ensuring their browser meets the technical requirements for optimal tool performance.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Content Accuracy</h2>
          
          <p className="text-muted-foreground mb-6">
            While we make every effort to ensure the accuracy of the information in our guides and blog posts, technology and best practices evolve rapidly. Users should verify information independently and consider the publication date of content when making decisions.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Availability and Maintenance</h2>
          
          <p className="text-muted-foreground mb-6">
            We strive to maintain continuous availability of our services but cannot guarantee uninterrupted access. The website may be temporarily unavailable due to maintenance, updates, or technical issues beyond our control.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Disclaimer</h2>
          
          <p className="text-muted-foreground mb-8">
            We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting on this page. Your continued use of the website after any changes constitutes acceptance of the new disclaimer.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this disclaimer, please contact us:
            </p>
            <div className="flex items-center gap-2 text-primary">
              <ExternalLink className="h-4 w-4" />
              <a href="/contact" className="hover:underline">Contact Page</a>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-8 text-center">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
}