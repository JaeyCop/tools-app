import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Document Quality Control | Professional Standards Guide",
  description: "Implement comprehensive quality control processes for documents. Learn validation techniques, error prevention, and quality assurance best practices.",
  keywords: ["document quality control", "quality assurance", "document validation", "error prevention", "quality standards"],
};

export default function QualityControlPage() {
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
              Document Quality Control
            </h1>
            <p className="text-xl text-muted-foreground">
              Establish robust quality control processes to ensure document accuracy, consistency, and professional standards across your organization.
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Cost of Poor Quality
                </h3>
                <p className="text-red-800 dark:text-red-200">
                  Document errors can cost organizations 10-30% of their revenue through rework, delays, compliance issues, and damaged reputation. Quality control is an investment, not an expense.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Document Quality</h2>
          
          <p className="text-muted-foreground mb-6">
            Document quality encompasses accuracy, consistency, completeness, accessibility, and compliance with standards. A systematic approach to quality control prevents errors and ensures professional output.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Quality Dimensions</h3>
          
          <div className="grid gap-4 mb-8">
            {[
              {
                dimension: "Accuracy",
                description: "Information is correct, factual, and error-free",
                examples: "Correct data, proper calculations, accurate references"
              },
              {
                dimension: "Consistency",
                description: "Uniform formatting, style, and terminology throughout",
                examples: "Consistent fonts, standardized terminology, uniform layouts"
              },
              {
                dimension: "Completeness",
                description: "All required information and sections are present",
                examples: "All fields filled, required approvals obtained, metadata complete"
              },
              {
                dimension: "Clarity",
                description: "Content is clear, understandable, and well-organized",
                examples: "Logical structure, clear language, appropriate detail level"
              },
              {
                dimension: "Compliance",
                description: "Adherence to standards, regulations, and requirements",
                examples: "Legal requirements, industry standards, company policies"
              }
            ].map((dim, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{dim.dimension}</h4>
                <p className="text-muted-foreground mb-2">{dim.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Examples:</strong> {dim.examples}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Quality Control Framework</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Prevention-Based Approach</h3>
          
          <p className="text-muted-foreground mb-4">
            The most effective quality control focuses on preventing errors rather than detecting them:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                strategy: "Templates and Standards",
                description: "Provide standardized templates and style guides to ensure consistency from the start"
              },
              {
                strategy: "Training and Guidelines",
                description: "Educate team members on quality standards and best practices"
              },
              {
                strategy: "Process Design",
                description: "Build quality checkpoints into document creation workflows"
              },
              {
                strategy: "Tool Integration",
                description: "Use software tools that enforce standards and catch errors automatically"
              }
            ].map((strategy, index) => (
              <div key={index} className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
                <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{strategy.strategy}</h4>
                  <p className="text-muted-foreground">{strategy.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Multi-Layer Validation</h3>
          
          <p className="text-muted-foreground mb-4">
            Implement multiple validation layers to catch different types of errors:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                layer: "Automated Checks",
                description: "Software-based validation for technical issues",
                examples: "Spell check, format validation, link verification"
              },
              {
                layer: "Peer Review",
                description: "Colleague review for content accuracy and clarity",
                examples: "Content review, fact-checking, readability assessment"
              },
              {
                layer: "Expert Review",
                description: "Subject matter expert validation for specialized content",
                examples: "Technical accuracy, compliance verification, legal review"
              }
            ].map((layer, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{layer.layer}</h4>
                <p className="text-muted-foreground text-sm mb-2">{layer.description}</p>
                <p className="text-xs text-muted-foreground/80"><strong>Examples:</strong> {layer.examples}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Automated Quality Checks</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Technical Validation</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Spelling and grammar checking with context-aware suggestions</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Format consistency validation (fonts, spacing, alignment)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Link verification and reference checking</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Image quality and resolution validation</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Accessibility compliance checking</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Content Analysis</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Advanced Content Validation
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Readability analysis and grade-level assessment</li>
              <li>• Terminology consistency checking</li>
              <li>• Brand compliance and style guide adherence</li>
              <li>• Plagiarism and originality verification</li>
              <li>• Data accuracy and calculation validation</li>
              <li>• Cross-reference and citation verification</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Human Review Processes</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Structured Review Methods</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                method: "Checklist-Based Review",
                description: "Systematic review using predefined quality criteria and checklists"
              },
              {
                method: "Role-Based Review",
                description: "Different reviewers focus on specific aspects based on their expertise"
              },
              {
                method: "Staged Review",
                description: "Multiple review rounds focusing on different quality dimensions"
              },
              {
                method: "Collaborative Review",
                description: "Team-based review with real-time collaboration and discussion"
              }
            ].map((method, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{method.method}</h4>
                <p className="text-muted-foreground">{method.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Review Efficiency</h3>
          
          <p className="text-muted-foreground mb-4">
            Optimize review processes to maintain quality while minimizing time and effort:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Focus reviews on high-risk or high-impact content</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use sampling for routine documents with established quality</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement risk-based review criteria</span>
            </li>
            <li className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Provide clear review guidelines and training</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Quality Metrics and Monitoring</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key Quality Indicators</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                metric: "Error Rate",
                description: "Number of errors per document or per page"
              },
              {
                metric: "Rework Percentage",
                description: "Percentage of documents requiring revision"
              },
              {
                metric: "Review Cycle Time",
                description: "Time from submission to approval"
              },
              {
                metric: "First-Pass Success Rate",
                description: "Percentage of documents approved without revision"
              },
              {
                metric: "Compliance Score",
                description: "Adherence to standards and requirements"
              },
              {
                metric: "Customer Satisfaction",
                description: "User feedback on document quality"
              }
            ].map((metric, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{metric.metric}</h4>
                <p className="text-muted-foreground text-sm">{metric.description}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Continuous Improvement</h3>
          
          <p className="text-muted-foreground mb-4">
            Use quality data to drive ongoing improvements:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Target className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Analyze error patterns to identify root causes</span>
            </li>
            <li className="flex items-start gap-3">
              <Target className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Update templates and guidelines based on common issues</span>
            </li>
            <li className="flex items-start gap-3">
              <Target className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Provide targeted training for recurring problems</span>
            </li>
            <li className="flex items-start gap-3">
              <Target className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Refine quality control processes based on effectiveness data</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Quality Control Tools</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Software Solutions</h3>
          
          <div className="space-y-4 mb-8">
            {[
              "Grammar and style checking tools (Grammarly, ProWritingAid)",
              "Document comparison and change tracking software",
              "Accessibility validation tools (WAVE, axe)",
              "Brand compliance and style guide enforcement tools",
              "Automated testing and validation platforms",
              "Quality management and workflow systems"
            ].map((tool, index) => (
              <div key={index} className="flex gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-green-800 dark:text-green-200">{tool}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Strategy</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Building a Quality Culture</h3>
          
          <p className="text-muted-foreground mb-4">
            Successful quality control requires organizational commitment and cultural change:
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
              Cultural Success Factors
            </h4>
            <ul className="text-yellow-800 dark:text-yellow-200 space-y-2">
              <li>• Leadership commitment to quality standards</li>
              <li>• Clear communication of quality expectations</li>
              <li>• Recognition and rewards for quality achievements</li>
              <li>• Learning from mistakes without blame</li>
              <li>• Continuous training and skill development</li>
              <li>• Regular feedback and improvement cycles</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Rollout Phases</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                phase: "Assessment",
                description: "Evaluate current quality levels and identify improvement areas"
              },
              {
                phase: "Standards Development",
                description: "Create quality standards, templates, and guidelines"
              },
              {
                phase: "Tool Implementation",
                description: "Deploy automated checking tools and review systems"
              },
              {
                phase: "Training and Adoption",
                description: "Train team members and establish quality processes"
              },
              {
                phase: "Monitoring and Refinement",
                description: "Track metrics and continuously improve the system"
              }
            ].map((phase, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{phase.phase}</h4>
                <p className="text-muted-foreground">{phase.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices Summary</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Quality Control Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Establish clear quality standards and expectations</li>
              <li>✓ Implement prevention-focused quality processes</li>
              <li>✓ Use multiple validation layers (automated + human)</li>
              <li>✓ Provide comprehensive training and resources</li>
              <li>✓ Monitor quality metrics and trends</li>
              <li>✓ Create feedback loops for continuous improvement</li>
              <li>✓ Integrate quality checks into workflows</li>
              <li>✓ Foster a culture of quality and accountability</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Effective document quality control is essential for professional credibility, operational efficiency, and risk management. A systematic approach combining prevention, detection, and continuous improvement delivers sustainable quality improvements.
          </p>

          <p className="text-muted-foreground">
            Start with the most critical documents and processes, then gradually expand your quality control system. Remember that quality is everyone's responsibility, and success requires both robust processes and a committed team culture.
          </p>
        </article>
      </div>
    </div>
  );
}