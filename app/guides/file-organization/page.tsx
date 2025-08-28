import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderTree, Search, Clock, Archive } from "lucide-react";

export const metadata: Metadata = {
  title: "Digital File Organization | Professional Management Guide",
  description: "Master digital file organization with proven naming conventions, folder structures, and management strategies for improved productivity and collaboration.",
  keywords: ["file organization", "digital file management", "naming conventions", "folder structure", "document management"],
};

export default function FileOrganizationPage() {
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
                <FolderTree className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
                Beginner
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Digital File Organization
            </h1>
            <p className="text-xl text-muted-foreground">
              Create efficient file organization systems that save time, reduce stress, and improve collaboration with proven strategies and best practices.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Clock className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Time Savings Potential
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Good file organization can save 30-60 minutes per day by reducing time spent searching for files, preventing duplicate work, and enabling faster collaboration.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Principles of Effective File Organization</h2>

          <p className="text-muted-foreground mb-6">
            Effective file organization is based on consistency, logic, and scalability. A well-designed system grows with your needs while remaining intuitive for all users.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Core Principles</h3>

          <div className="grid gap-4 mb-8">
            {[
              {
                principle: "Consistency",
                description: "Use the same naming conventions and folder structures throughout your system",
                benefit: "Reduces confusion and makes files predictable to find"
              },
              {
                principle: "Hierarchy",
                description: "Organize files in logical, nested folder structures from general to specific",
                benefit: "Enables intuitive navigation and browsing"
              },
              {
                principle: "Descriptive Naming",
                description: "Use clear, descriptive names that explain the file's content and purpose",
                benefit: "Makes files searchable and self-documenting"
              },
              {
                principle: "Version Control",
                description: "Implement systematic versioning for documents that change over time",
                benefit: "Prevents confusion and enables tracking of changes"
              },
              {
                principle: "Regular Maintenance",
                description: "Periodically review, clean up, and reorganize your file system",
                benefit: "Keeps the system efficient and prevents digital clutter"
              }
            ].map((principle, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{principle.principle}</h4>
                <p className="text-muted-foreground mb-2">{principle.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Benefit:</strong> {principle.benefit}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Folder Structure Strategies</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Organizational Approaches</h3>

          <div className="space-y-4 mb-8">
            {[
              {
                approach: "Project-Based Structure",
                description: "Organize files by project or initiative",
                example: "Projects > 2024-Website-Redesign > Design > Mockups",
                bestFor: "Project-driven work, creative agencies, consulting"
              },
              {
                approach: "Functional Structure",
                description: "Group files by department or function",
                example: "Marketing > Campaigns > 2024 > Q1 > Social-Media",
                bestFor: "Large organizations, departmental work"
              },
              {
                approach: "Client-Based Structure",
                description: "Organize around clients or customers",
                example: "Clients > ABC-Corp > Contracts > 2024-Service-Agreement",
                bestFor: "Service businesses, agencies, consultants"
              },
              {
                approach: "Date-Based Structure",
                description: "Primary organization by time periods",
                example: "2024 > 03-March > Reports > Weekly-Status-Report",
                bestFor: "Time-sensitive work, regular reporting"
              },
              {
                approach: "Hybrid Structure",
                description: "Combination of multiple approaches",
                example: "2024 > Projects > Client-ABC > Design > Mockups",
                bestFor: "Complex organizations, varied work types"
              }
            ].map((approach, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{approach.approach}</h4>
                <p className="text-muted-foreground mb-2">{approach.description}</p>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-2 mb-2">
                  <code className="text-sm text-foreground">{approach.example}</code>
                </div>
                <p className="text-sm text-muted-foreground/80"><strong>Best for:</strong> {approach.bestFor}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Folder Hierarchy Best Practices</h3>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Limit folder depth to 4-5 levels to avoid deep nesting</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use 2-digit prefixes for chronological ordering (01, 02, 03)</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Create "Archive" folders for completed or outdated materials</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use "Working" or "Draft" folders for active, in-progress files</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Include README files in complex folder structures</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">File Naming Conventions</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Naming Formula</h3>

          <p className="text-muted-foreground mb-4">
            Develop a consistent naming formula that includes key information:
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Standard Naming Formula
            </h4>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-4 mb-4">
              <code className="text-sm text-foreground">
                YYYY-MM-DD_Document-Type_Project-Name_Version
              </code>
            </div>
            <p className="text-blue-800 dark:text-blue-200 mb-4">Example:</p>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded p-4">
              <code className="text-sm text-foreground">
                2024-03-15_Proposal_Website-Redesign_v2.1
              </code>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Naming Best Practices</h3>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-green-700 dark:text-green-300">✓ Do</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use descriptive, meaningful names</li>
                <li>• Include dates in YYYY-MM-DD format</li>
                <li>• Use hyphens or underscores instead of spaces</li>
                <li>• Keep names under 255 characters</li>
                <li>• Use consistent capitalization</li>
                <li>• Include version numbers for drafts</li>
                <li>• Add status indicators (DRAFT, FINAL, APPROVED)</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground text-red-700 dark:text-red-300">✗ Don't</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use special characters (/, &#92;, :, *, ?, &quot;, &lt;, &gt;, |)</li>
                <li>• Start names with periods or spaces</li>
                <li>• Use vague names like "Document1" or "Untitled"</li>
                <li>• Include personal names unless necessary</li>
                <li>• Use inconsistent date formats</li>
                <li>• Create overly long file names</li>
                <li>• Use abbreviations without documentation</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Version Control Strategies</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Version Numbering Systems</h3>

          <div className="space-y-4 mb-8">
            {[
              {
                system: "Simple Sequential",
                format: "v1, v2, v3",
                description: "Basic numbering for simple documents",
                bestFor: "Internal documents, simple workflows"
              },
              {
                system: "Decimal Versioning",
                format: "v1.0, v1.1, v1.2",
                description: "Major.minor version numbering",
                bestFor: "Documents with major and minor revisions"
              },
              {
                system: "Semantic Versioning",
                format: "v1.2.3",
                description: "Major.minor.patch for complex documents",
                bestFor: "Technical documentation, software-related docs"
              },
              {
                system: "Date-Based Versioning",
                format: "v2024.03.15",
                description: "Version based on creation or revision date",
                bestFor: "Time-sensitive documents, regular reports"
              }
            ].map((system, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{system.system}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {system.format}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">{system.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Best for:</strong> {system.bestFor}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Version Management Tips</h3>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Archive className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Keep only the current version and 2-3 previous versions in active folders</span>
            </li>
            <li className="flex items-start gap-3">
              <Archive className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Archive older versions to separate "Archive" or "Previous Versions" folders</span>
            </li>
            <li className="flex items-start gap-3">
              <Archive className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use "FINAL" designation for completed, approved documents</span>
            </li>
            <li className="flex items-start gap-3">
              <Archive className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Maintain a change log for complex documents</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Search and Retrieval Optimization</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Metadata and Tagging</h3>

          <p className="text-muted-foreground mb-4">
            Enhance findability with metadata and tagging strategies:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Search className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use document properties to add keywords, authors, and descriptions</span>
            </li>
            <li className="flex items-start gap-3">
              <Search className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Include relevant keywords in file names and folder names</span>
            </li>
            <li className="flex items-start gap-3">
              <Search className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Create and maintain a master index or catalog for large collections</span>
            </li>
            <li className="flex items-start gap-3">
              <Search className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use consistent terminology and avoid synonyms</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Search Strategies</h3>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-4">
              Effective Search Techniques
            </h4>
            <ul className="text-yellow-800 dark:text-yellow-200 space-y-2">
              <li>• Use specific keywords rather than generic terms</li>
              <li>• Search by file type when looking for specific formats</li>
              <li>• Use date ranges to narrow down results</li>
              <li>• Search within specific folders to limit scope</li>
              <li>• Use wildcards (*) for partial matches</li>
              <li>• Save frequently used searches as shortcuts</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Collaboration and Sharing</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Shared Folder Guidelines</h3>

          <p className="text-muted-foreground mb-4">
            When working with teams, establish clear guidelines for shared spaces:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Create clear folder permissions and access levels</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Establish naming conventions that all team members follow</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use "Working" folders for collaborative editing</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement check-out/check-in procedures for critical documents</span>
            </li>
            <li className="flex items-start gap-3">
              <FolderTree className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Regularly communicate changes to folder structure</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Maintenance and Cleanup</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Regular Maintenance Schedule</h3>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                frequency: "Weekly",
                tasks: ["Delete unnecessary downloads", "Empty trash/recycle bin", "File new documents properly"]
              },
              {
                frequency: "Monthly",
                tasks: ["Archive completed projects", "Review and clean desktop", "Update folder structures"]
              },
              {
                frequency: "Quarterly",
                tasks: ["Major cleanup and reorganization", "Review naming conventions", "Backup important files"]
              }
            ].map((schedule, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-3">{schedule.frequency}</h4>
                <ul className="text-muted-foreground text-sm space-y-1">
                  {schedule.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>• {task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Guide</h2>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              File Organization Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Choose an organizational approach that fits your work style</li>
              <li>✓ Develop consistent naming conventions</li>
              <li>✓ Create a logical folder hierarchy (4-5 levels max)</li>
              <li>✓ Implement version control for changing documents</li>
              <li>✓ Set up archive folders for completed work</li>
              <li>✓ Document your system for team members</li>
              <li>✓ Schedule regular maintenance and cleanup</li>
              <li>✓ Train team members on the system</li>
              <li>✓ Backup important files regularly</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>

          <p className="text-muted-foreground mb-6">
            Effective file organization is an investment in productivity and peace of mind. A well-designed system saves time, reduces stress, and enables better collaboration while growing with your needs.
          </p>

          <p className="text-muted-foreground">
            Start by organizing your most important or frequently used files, then gradually expand the system. Remember that the best organization system is one that you and your team will actually use consistently.
          </p>
        </article>
      </div>
    </div>
  );
}