import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Document Security Best Practices | Comprehensive Protection Guide",
  description: "Protect sensitive documents with comprehensive security strategies including encryption, access controls, and threat prevention measures.",
  keywords: ["document security", "data protection", "encryption", "access control", "cybersecurity"],
};

export default function DocumentSecurityPage() {
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
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                Advanced
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Document Security Best Practices
            </h1>
            <p className="text-xl text-muted-foreground">
              Implement comprehensive document security measures to protect sensitive information from unauthorized access, data breaches, and cyber threats.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Security Threats Are Real
                </h3>
                <p className="text-red-800 dark:text-red-200">
                  Data breaches cost organizations an average of $4.45 million globally. Document security isn't optional—it's essential for protecting your business, customers, and reputation.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Document Security Threats</h2>
          
          <p className="text-muted-foreground mb-6">
            Document security threats come from multiple sources and can have devastating consequences. Understanding these threats is the first step in building effective defenses.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Common Threat Vectors</h3>
          
          <div className="grid gap-4 mb-8">
            {[
              {
                threat: "Unauthorized Access",
                description: "Individuals gaining access to documents they shouldn't see",
                examples: "Weak passwords, shared accounts, insider threats"
              },
              {
                threat: "Data Interception",
                description: "Documents being intercepted during transmission or storage",
                examples: "Unencrypted email, unsecured cloud storage, network eavesdropping"
              },
              {
                threat: "Malware and Ransomware",
                description: "Malicious software targeting document systems",
                examples: "Document-based malware, encryption ransomware, data theft trojans"
              },
              {
                threat: "Physical Security Breaches",
                description: "Physical access to devices or storage media",
                examples: "Stolen devices, unsecured workstations, dumpster diving"
              },
              {
                threat: "Social Engineering",
                description: "Manipulation tactics to gain access to documents",
                examples: "Phishing emails, pretexting, baiting attacks"
              }
            ].map((threat, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{threat.threat}</h4>
                <p className="text-muted-foreground mb-2">{threat.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Examples:</strong> {threat.examples}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Security Framework</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Defense in Depth Strategy</h3>
          
          <p className="text-muted-foreground mb-4">
            Implement multiple layers of security controls to protect documents:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                layer: "Physical Security",
                description: "Secure physical access to devices and storage",
                controls: "Locked offices, secure storage, device encryption"
              },
              {
                layer: "Network Security",
                description: "Protect data in transit and network access",
                controls: "Firewalls, VPNs, encrypted connections"
              },
              {
                layer: "Application Security",
                description: "Secure document management applications",
                controls: "Access controls, audit logging, secure coding"
              },
              {
                layer: "Data Security",
                description: "Protect the documents themselves",
                controls: "Encryption, digital signatures, watermarking"
              },
              {
                layer: "User Security",
                description: "Control and monitor user access",
                controls: "Authentication, authorization, training"
              }
            ].map((layer, index) => (
              <div key={index} className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
                <Shield className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{layer.layer}</h4>
                  <p className="text-muted-foreground mb-2">{layer.description}</p>
                  <p className="text-sm text-muted-foreground/80"><strong>Controls:</strong> {layer.controls}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Access Control and Authentication</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Identity and Access Management</h3>
          
          <p className="text-muted-foreground mb-4">
            Control who can access documents and what they can do with them:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement strong password policies with complexity requirements</span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Enable multi-factor authentication (MFA) for sensitive systems</span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use role-based access control (RBAC) to limit permissions</span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement principle of least privilege</span>
            </li>
            <li className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Regular access reviews and deprovisioning</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Permission Models</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                model: "Read-Only Access",
                description: "Users can view but not modify documents",
                useCase: "Reference materials, published policies"
              },
              {
                model: "Edit Access",
                description: "Users can modify document content",
                useCase: "Collaborative documents, working drafts"
              },
              {
                model: "Full Control",
                description: "Users can modify content and permissions",
                useCase: "Document owners, administrators"
              },
              {
                model: "Time-Limited Access",
                description: "Access expires after a specified period",
                useCase: "Temporary contractors, project-based access"
              }
            ].map((model, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{model.model}</h4>
                <p className="text-muted-foreground text-sm mb-2">{model.description}</p>
                <p className="text-xs text-muted-foreground/80"><strong>Use case:</strong> {model.useCase}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Encryption and Data Protection</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Encryption Standards</h3>
          
          <p className="text-muted-foreground mb-4">
            Use strong encryption to protect documents at rest and in transit:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                type: "AES-256 Encryption",
                description: "Industry-standard symmetric encryption for document protection",
                strength: "Military-grade security"
              },
              {
                type: "RSA Encryption",
                description: "Asymmetric encryption for secure key exchange and digital signatures",
                strength: "Strong public-key cryptography"
              },
              {
                type: "TLS/SSL",
                description: "Encryption for data in transit over networks",
                strength: "Secure communication channels"
              },
              {
                type: "End-to-End Encryption",
                description: "Encryption from sender to recipient with no intermediate decryption",
                strength: "Maximum privacy protection"
              }
            ].map((encryption, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{encryption.type}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {encryption.strength}
                  </span>
                </div>
                <p className="text-muted-foreground">{encryption.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key Management</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Key Management Best Practices
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Use hardware security modules (HSMs) for key storage</li>
              <li>• Implement key rotation policies</li>
              <li>• Separate key management from data storage</li>
              <li>• Maintain secure key backup and recovery procedures</li>
              <li>• Use strong random number generation for keys</li>
              <li>• Implement key escrow for business continuity</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Secure Document Handling</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Creation and Storage</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Create documents on secure, managed devices</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Store documents in approved, secure repositories</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement automatic classification and labeling</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use version control with audit trails</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Transmission and Sharing</h3>
          
          <div className="space-y-4 mb-8">
            {[
              "Use encrypted email or secure file transfer protocols",
              "Implement secure sharing platforms with access controls",
              "Avoid public cloud storage for sensitive documents",
              "Use digital rights management (DRM) for controlled sharing",
              "Implement watermarking for document tracking",
              "Set expiration dates for shared documents"
            ].map((practice, index) => (
              <div key={index} className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-green-800 dark:text-green-200">{practice}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Monitoring and Compliance</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Audit and Logging</h3>
          
          <p className="text-muted-foreground mb-4">
            Maintain comprehensive logs of document access and activities:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Log all document access, modifications, and sharing activities</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Monitor for unusual access patterns or suspicious behavior</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement real-time alerts for security events</span>
            </li>
            <li className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Regularly review and analyze audit logs</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Compliance Requirements</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                regulation: "GDPR",
                description: "EU data protection regulation",
                requirements: "Consent, data minimization, breach notification"
              },
              {
                regulation: "HIPAA",
                description: "US healthcare privacy law",
                requirements: "PHI protection, access controls, audit trails"
              },
              {
                regulation: "SOX",
                description: "US financial reporting law",
                requirements: "Document retention, access controls, audit trails"
              },
              {
                regulation: "ISO 27001",
                description: "International security standard",
                requirements: "Risk management, security controls, continuous improvement"
              }
            ].map((reg, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{reg.regulation}</h4>
                <p className="text-muted-foreground text-sm mb-2">{reg.description}</p>
                <p className="text-xs text-muted-foreground/80"><strong>Key requirements:</strong> {reg.requirements}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Incident Response</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Security Incident Plan</h3>
          
          <p className="text-muted-foreground mb-4">
            Prepare for security incidents with a comprehensive response plan:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                phase: "Detection",
                description: "Identify and confirm security incidents",
                actions: "Monitor alerts, investigate anomalies, assess impact"
              },
              {
                phase: "Containment",
                description: "Limit the scope and impact of the incident",
                actions: "Isolate affected systems, revoke access, preserve evidence"
              },
              {
                phase: "Eradication",
                description: "Remove the threat and vulnerabilities",
                actions: "Remove malware, patch vulnerabilities, update controls"
              },
              {
                phase: "Recovery",
                description: "Restore normal operations safely",
                actions: "Restore systems, monitor for recurrence, validate security"
              },
              {
                phase: "Lessons Learned",
                description: "Improve security based on the incident",
                actions: "Document findings, update procedures, train staff"
              }
            ].map((phase, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{phase.phase}</h4>
                <p className="text-muted-foreground mb-2">{phase.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Actions:</strong> {phase.actions}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">User Training and Awareness</h2>
          
          <p className="text-muted-foreground mb-4">
            Human factors are often the weakest link in security. Comprehensive training is essential:
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
              Security Training Topics
            </h4>
            <ul className="text-yellow-800 dark:text-yellow-200 space-y-2">
              <li>• Password security and multi-factor authentication</li>
              <li>• Recognizing and avoiding phishing attacks</li>
              <li>• Proper document handling and classification</li>
              <li>• Secure sharing and transmission practices</li>
              <li>• Physical security awareness</li>
              <li>• Incident reporting procedures</li>
              <li>• Compliance requirements and responsibilities</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Roadmap</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Document Security Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Conduct security risk assessment</li>
              <li>✓ Implement strong authentication and access controls</li>
              <li>✓ Deploy encryption for data at rest and in transit</li>
              <li>✓ Establish secure document handling procedures</li>
              <li>✓ Implement monitoring and audit logging</li>
              <li>✓ Develop incident response procedures</li>
              <li>✓ Provide comprehensive security training</li>
              <li>✓ Ensure compliance with relevant regulations</li>
              <li>✓ Regular security reviews and updates</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Document security requires a comprehensive, multi-layered approach that addresses technical, procedural, and human factors. The cost of implementing robust security measures is far less than the potential cost of a security breach.
          </p>

          <p className="text-muted-foreground">
            Start with the most critical documents and highest-risk scenarios, then gradually expand your security program. Regular assessment, training, and improvement ensure your security measures remain effective against evolving threats.
          </p>
        </article>
      </div>
    </div>
  );
}