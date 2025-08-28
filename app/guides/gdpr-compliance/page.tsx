import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, Shield, FileText, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "GDPR Compliance for Document Processing | Legal Guide",
  description: "Comprehensive guide to GDPR compliance for document processing services. Learn requirements, implementation strategies, and best practices.",
  keywords: ["GDPR compliance", "data protection", "privacy law", "document processing", "EU regulations"],
};

export default function GDPRCompliancePage() {
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
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                Advanced
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              GDPR Compliance for Document Processing
            </h1>
            <p className="text-xl text-muted-foreground">
              Navigate GDPR requirements for document processing services with comprehensive compliance strategies and implementation guidance.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Legal Disclaimer
                </h3>
                <p className="text-red-800 dark:text-red-200">
                  This guide provides general information about GDPR compliance. It is not legal advice. Consult with qualified legal professionals for specific compliance requirements in your jurisdiction.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding GDPR</h2>
          
          <p className="text-muted-foreground mb-6">
            The General Data Protection Regulation (GDPR) is the EU's comprehensive data protection law that applies to any organization processing personal data of EU residents, regardless of where the organization is located.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key GDPR Principles</h3>
          
          <div className="grid gap-4 mb-8">
            {[
              {
                principle: "Lawfulness, Fairness, and Transparency",
                description: "Processing must be lawful, fair, and transparent to the data subject",
                application: "Clear privacy notices, legitimate processing basis"
              },
              {
                principle: "Purpose Limitation",
                description: "Data collected for specified, explicit, and legitimate purposes",
                application: "Document specific use cases, avoid scope creep"
              },
              {
                principle: "Data Minimization",
                description: "Data must be adequate, relevant, and limited to what's necessary",
                application: "Process only required document data, avoid over-collection"
              },
              {
                principle: "Accuracy",
                description: "Data must be accurate and kept up to date",
                application: "Implement data quality controls and correction mechanisms"
              },
              {
                principle: "Storage Limitation",
                description: "Data kept only as long as necessary for the purposes",
                application: "Define retention periods, implement deletion policies"
              },
              {
                principle: "Integrity and Confidentiality",
                description: "Appropriate security measures to protect data",
                application: "Encryption, access controls, security monitoring"
              }
            ].map((principle, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{principle.principle}</h4>
                <p className="text-muted-foreground mb-2">{principle.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Application:</strong> {principle.application}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Legal Basis for Processing</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Six Lawful Bases</h3>
          
          <p className="text-muted-foreground mb-4">
            GDPR requires at least one lawful basis for processing personal data:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                basis: "Consent",
                description: "Data subject has given clear consent for processing",
                requirements: "Freely given, specific, informed, unambiguous",
                suitability: "Good for optional features, marketing"
              },
              {
                basis: "Contract",
                description: "Processing necessary for contract performance",
                requirements: "Must be necessary, not just convenient",
                suitability: "Document processing services, user accounts"
              },
              {
                basis: "Legal Obligation",
                description: "Processing required to comply with legal obligations",
                requirements: "Must be a clear legal requirement",
                suitability: "Tax records, audit requirements"
              },
              {
                basis: "Vital Interests",
                description: "Processing necessary to protect vital interests",
                requirements: "Life or death situations only",
                suitability: "Emergency situations, medical data"
              },
              {
                basis: "Public Task",
                description: "Processing for public interest or official authority",
                requirements: "Must have clear public interest basis",
                suitability: "Government services, public organizations"
              },
              {
                basis: "Legitimate Interests",
                description: "Processing necessary for legitimate interests",
                requirements: "Must pass balancing test against data subject rights",
                suitability: "Business operations, fraud prevention"
              }
            ].map((basis, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{basis.basis}</h4>
                <p className="text-muted-foreground mb-2">{basis.description}</p>
                <p className="text-sm text-muted-foreground/80 mb-1"><strong>Requirements:</strong> {basis.requirements}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Best for:</strong> {basis.suitability}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Data Subject Rights</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Individual Rights Under GDPR</h3>
          
          <p className="text-muted-foreground mb-4">
            GDPR grants individuals extensive rights over their personal data:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                right: "Right to Information",
                description: "Clear information about data processing",
                implementation: "Privacy notices, processing explanations"
              },
              {
                right: "Right of Access",
                description: "Access to personal data and processing information",
                implementation: "Data export features, processing logs"
              },
              {
                right: "Right to Rectification",
                description: "Correction of inaccurate personal data",
                implementation: "Data correction interfaces, update mechanisms"
              },
              {
                right: "Right to Erasure",
                description: "Deletion of personal data in certain circumstances",
                implementation: "Account deletion, data purging systems"
              },
              {
                right: "Right to Restrict Processing",
                description: "Limitation of processing in certain situations",
                implementation: "Processing flags, temporary suspension"
              },
              {
                right: "Right to Data Portability",
                description: "Receive data in structured, machine-readable format",
                implementation: "Data export in standard formats"
              },
              {
                right: "Right to Object",
                description: "Object to processing based on legitimate interests",
                implementation: "Opt-out mechanisms, processing cessation"
              },
              {
                right: "Rights Related to Automated Decision-Making",
                description: "Protection from solely automated decisions",
                implementation: "Human review processes, explanation mechanisms"
              }
            ].map((right, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{right.right}</h4>
                <p className="text-muted-foreground text-sm mb-2">{right.description}</p>
                <p className="text-xs text-muted-foreground/80"><strong>Implementation:</strong> {right.implementation}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Document Processing Compliance</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Privacy by Design Implementation</h3>
          
          <p className="text-muted-foreground mb-4">
            Build GDPR compliance into your document processing from the ground up:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Process documents locally on user devices when possible</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Minimize data collection to only what's necessary for processing</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement strong encryption for any data transmission or storage</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Provide clear, granular consent mechanisms</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Enable easy data deletion and account removal</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Data Processing Records</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Required Documentation (Article 30)
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Name and contact details of controller/processor</li>
              <li>• Purposes of processing</li>
              <li>• Categories of data subjects and personal data</li>
              <li>• Recipients of personal data</li>
              <li>• International transfers and safeguards</li>
              <li>• Retention periods</li>
              <li>• Technical and organizational security measures</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Technical and Organizational Measures</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Security Requirements</h3>
          
          <p className="text-muted-foreground mb-4">
            GDPR requires appropriate technical and organizational measures to ensure data security:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                category: "Technical Measures",
                measures: [
                  "Encryption of personal data at rest and in transit",
                  "Regular security testing and vulnerability assessments",
                  "Access controls and authentication mechanisms",
                  "Secure software development practices",
                  "Data backup and recovery procedures"
                ]
              },
              {
                category: "Organizational Measures",
                measures: [
                  "Staff training on data protection",
                  "Data protection policies and procedures",
                  "Incident response and breach notification procedures",
                  "Regular compliance audits and reviews",
                  "Vendor management and due diligence"
                ]
              }
            ].map((category, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">{category.category}</h4>
                <ul className="space-y-2">
                  {category.measures.map((measure, measureIndex) => (
                    <li key={measureIndex} className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Data Breach Management</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Breach Notification Requirements</h3>
          
          <p className="text-muted-foreground mb-4">
            GDPR has strict requirements for data breach notification:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                timeline: "72 Hours",
                requirement: "Notify Supervisory Authority",
                details: "Unless breach unlikely to result in risk to rights and freedoms"
              },
              {
                timeline: "Without Delay",
                requirement: "Notify Data Subjects",
                details: "If breach likely to result in high risk to rights and freedoms"
              },
              {
                timeline: "Immediately",
                requirement: "Internal Documentation",
                details: "Document all breaches regardless of notification requirements"
              }
            ].map((req, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border text-center">
                <div className="text-2xl font-bold text-primary mb-2">{req.timeline}</div>
                <h4 className="font-semibold text-foreground mb-2">{req.requirement}</h4>
                <p className="text-muted-foreground text-sm">{req.details}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">International Data Transfers</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Transfer Mechanisms</h3>
          
          <p className="text-muted-foreground mb-4">
            When transferring personal data outside the EU, you must ensure adequate protection:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Adequacy decisions for countries with equivalent protection</span>
            </li>
            <li className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Standard Contractual Clauses (SCCs) with appropriate safeguards</span>
            </li>
            <li className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Binding Corporate Rules for multinational organizations</span>
            </li>
            <li className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Certification schemes and codes of conduct</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Penalties and Enforcement</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">GDPR Fines</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Lower Tier Violations</h4>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">Up to €10M</div>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mb-2">or 2% of annual global turnover</p>
              <ul className="text-yellow-800 dark:text-yellow-200 text-xs space-y-1">
                <li>• Inadequate records of processing</li>
                <li>• Failure to notify breaches</li>
                <li>• Inadequate impact assessments</li>
              </ul>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Higher Tier Violations</h4>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">Up to €20M</div>
              <p className="text-red-800 dark:text-red-200 text-sm mb-2">or 4% of annual global turnover</p>
              <ul className="text-red-800 dark:text-red-200 text-xs space-y-1">
                <li>• Violations of core principles</li>
                <li>• Unlawful processing</li>
                <li>• Violations of data subject rights</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Compliance Implementation</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              GDPR Compliance Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Identify lawful basis for all data processing</li>
              <li>✓ Implement privacy by design principles</li>
              <li>✓ Create comprehensive privacy notices</li>
              <li>✓ Establish data subject rights procedures</li>
              <li>✓ Implement appropriate security measures</li>
              <li>✓ Maintain records of processing activities</li>
              <li>✓ Develop data breach response procedures</li>
              <li>✓ Conduct privacy impact assessments</li>
              <li>✓ Train staff on GDPR requirements</li>
              <li>✓ Regular compliance audits and reviews</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Ongoing Compliance</h3>
          
          <p className="text-muted-foreground mb-6">
            GDPR compliance is not a one-time effort but requires ongoing attention and improvement:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Regular review and update of privacy notices and procedures</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Continuous monitoring of data processing activities</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Stay updated on regulatory guidance and enforcement actions</span>
            </li>
            <li className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Regular staff training and awareness programs</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            GDPR compliance for document processing requires careful attention to legal requirements, technical implementation, and ongoing governance. While complex, compliance is achievable with proper planning and commitment to privacy protection.
          </p>

          <p className="text-muted-foreground">
            Remember that GDPR is about more than avoiding fines—it's about building trust with users and creating sustainable, privacy-respecting business practices. When in doubt, consult with legal experts who specialize in data protection law.
          </p>
        </article>
      </div>
    </div>
  );
}