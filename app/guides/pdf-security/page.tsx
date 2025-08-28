import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "PDF Security Best Practices | Complete Guide",
  description: "Learn how to secure your PDF documents with passwords, encryption, and digital signatures. Comprehensive guide to PDF security features and implementation.",
  keywords: ["PDF security", "document encryption", "password protection", "digital signatures", "PDF permissions"],
};

export default function PDFSecurityPage() {
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
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                Intermediate
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              PDF Security Best Practices
            </h1>
            <p className="text-xl text-muted-foreground">
              Protect your sensitive documents with comprehensive PDF security measures including encryption, passwords, and digital signatures.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Security is Critical
                </h3>
                <p className="text-red-800 dark:text-red-200">
                  Unsecured PDFs can expose sensitive information, lead to data breaches, and compromise confidential business or personal data. Proper security measures are essential.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding PDF Security</h2>
          
          <p className="text-muted-foreground mb-6">
            PDF security involves multiple layers of protection to control who can access, view, edit, print, or copy your documents. Understanding these layers helps you choose the right security measures for your needs.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Types of PDF Security</h3>
          
          <div className="grid gap-4 mb-8">
            {[
              {
                icon: Lock,
                title: "Password Protection",
                description: "Require passwords to open documents or perform specific actions like editing or printing."
              },
              {
                icon: Shield,
                title: "Encryption",
                description: "Scramble document content using advanced encryption algorithms to prevent unauthorized access."
              },
              {
                icon: Eye,
                title: "Permission Controls",
                description: "Set specific permissions for what users can do with the document once opened."
              }
            ].map((type, index) => (
              <div key={index} className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
                <type.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{type.title}</h4>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Password Protection Strategies</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">User Password vs Owner Password</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">User Password</h4>
              <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                <li>• Required to open the document</li>
                <li>• Controls document access</li>
                <li>• Also called "Document Open Password"</li>
                <li>• Provides strongest protection</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Owner Password</h4>
              <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                <li>• Controls editing permissions</li>
                <li>• Allows changing security settings</li>
                <li>• Also called "Permissions Password"</li>
                <li>• Document can still be opened without it</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Password Best Practices</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use strong passwords with at least 12 characters including uppercase, lowercase, numbers, and symbols</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Avoid common words, personal information, or predictable patterns</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use unique passwords for different documents or document categories</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Consider using password managers to generate and store complex passwords</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Encryption Standards</h2>
          
          <p className="text-muted-foreground mb-4">
            PDF encryption uses industry-standard algorithms to protect your documents:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                title: "AES 256-bit Encryption",
                description: "The strongest encryption available for PDFs, used by government and military organizations.",
                strength: "Maximum Security"
              },
              {
                title: "AES 128-bit Encryption",
                description: "Strong encryption suitable for most business and personal use cases.",
                strength: "High Security"
              },
              {
                title: "RC4 128-bit Encryption",
                description: "Older standard, still secure but AES is recommended for new documents.",
                strength: "Moderate Security"
              }
            ].map((encryption, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{encryption.title}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {encryption.strength}
                  </span>
                </div>
                <p className="text-muted-foreground">{encryption.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Permission Controls</h2>
          
          <p className="text-muted-foreground mb-4">
            Fine-tune what users can do with your documents even after they're opened:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              "Printing (allow/deny or high-quality only)",
              "Text and image extraction",
              "Document modification and editing",
              "Adding or modifying annotations",
              "Form field completion",
              "Document assembly and page manipulation",
              "Content copying for accessibility",
              "Digital signature creation"
            ].map((permission, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg border border-border">
                <Lock className="h-4 w-4 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{permission}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Digital Signatures</h2>
          
          <p className="text-muted-foreground mb-4">
            Digital signatures provide authentication and integrity verification for your PDFs:
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Benefits of Digital Signatures</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Verify document authenticity and author identity</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Detect any changes made after signing</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Provide legal validity in many jurisdictions</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Enable secure document workflows</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Security Implementation</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Choosing the Right Security Level</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                level: "Public Documents",
                security: "Basic or no security",
                description: "Marketing materials, public reports, general information"
              },
              {
                level: "Internal Documents",
                security: "Password protection + permissions",
                description: "Company policies, internal communications, draft documents"
              },
              {
                level: "Confidential Documents",
                security: "Strong encryption + strict permissions",
                description: "Financial reports, legal documents, personal information"
              },
              {
                level: "Highly Sensitive Documents",
                security: "Maximum encryption + digital signatures",
                description: "Trade secrets, classified information, legal contracts"
              }
            ].map((category, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{category.level}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded">
                    {category.security}
                  </span>
                </div>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Security Limitations</h2>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Important Security Considerations
                </h4>
                <ul className="text-yellow-800 dark:text-yellow-200 space-y-2">
                  <li>• PDF security can be bypassed by determined attackers with specialized tools</li>
                  <li>• Screen capture and photography can circumvent viewing restrictions</li>
                  <li>• Older PDF versions may have weaker security implementations</li>
                  <li>• Security is only as strong as password management practices</li>
                  <li>• Consider additional security measures for highly sensitive documents</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices Summary</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Security Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Assess document sensitivity and choose appropriate security level</li>
              <li>✓ Use strong, unique passwords for document protection</li>
              <li>✓ Apply the highest encryption standard available (AES 256-bit)</li>
              <li>✓ Set appropriate permissions based on intended use</li>
              <li>✓ Consider digital signatures for authentication</li>
              <li>✓ Regularly review and update security practices</li>
              <li>✓ Train users on proper password management</li>
              <li>✓ Test security settings before distributing documents</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            PDF security is a multi-layered approach that requires careful consideration of your specific needs and threat model. By implementing appropriate security measures, you can protect sensitive information while maintaining document usability.
          </p>

          <p className="text-muted-foreground">
            Remember that security is an ongoing process. Regularly review your security practices, stay updated on new threats and protection methods, and adjust your approach as your needs evolve.
          </p>
        </article>
      </div>
    </div>
  );
}