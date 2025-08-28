import Link from "next/link";
import { BookOpen, FileText, Image, Zap, Shield, Users, ArrowRight, Clock, Star, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Complete Guides & Tutorials",
  description: "Comprehensive guides for PDF and image processing. Learn best practices, advanced techniques, and optimization strategies from industry experts.",
  keywords: ["PDF guides", "image processing tutorials", "file optimization", "document management", "digital workflows"],
};

const guideCategories = [
  {
    title: "PDF Processing Mastery",
    description: "Everything you need to know about working with PDF documents",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    guides: [
      {
        title: "The Complete PDF Optimization Guide",
        description: "Learn professional techniques to reduce PDF file sizes by 50-90% while maintaining quality",
        difficulty: "Intermediate",
        readTime: "8 min",
        href: "/blog/pdf-optimization-guide",
        featured: true
      },
      {
        title: "PDF Accessibility Best Practices",
        description: "Create PDFs that work for everyone, including users with disabilities",
        difficulty: "Advanced",
        readTime: "12 min",
        href: "/guides/pdf-accessibility",
        featured: false
      },
      {
        title: "Batch PDF Processing Workflows",
        description: "Automate repetitive PDF tasks and handle large document collections efficiently",
        difficulty: "Advanced",
        readTime: "10 min",
        href: "/guides/batch-pdf-processing",
        featured: false
      },
      {
        title: "PDF Security and Privacy",
        description: "Protect sensitive documents and understand PDF security features",
        difficulty: "Intermediate",
        readTime: "7 min",
        href: "/guides/pdf-security",
        featured: false
      }
    ]
  },
  {
    title: "Image Processing Excellence",
    description: "Master the art and science of digital image optimization",
    icon: Image,
    color: "from-green-500 to-green-600",
    guides: [
      {
        title: "Image Formats Explained: JPEG vs PNG vs WebP",
        description: "Make informed decisions about image format selection for any project",
        difficulty: "Beginner",
        readTime: "6 min",
        href: "/blog/image-formats-explained",
        featured: true
      },
      {
        title: "Advanced Image Compression Techniques",
        description: "Deep dive into compression algorithms and optimization strategies",
        difficulty: "Advanced",
        readTime: "15 min",
        href: "/guides/image-compression-advanced",
        featured: false
      },
      {
        title: "Color Space and Profile Management",
        description: "Understand color spaces, ICC profiles, and color accuracy",
        difficulty: "Advanced",
        readTime: "11 min",
        href: "/guides/color-management",
        featured: false
      },
      {
        title: "Web Image Optimization",
        description: "Optimize images for web performance without sacrificing quality",
        difficulty: "Intermediate",
        readTime: "9 min",
        href: "/guides/web-image-optimization",
        featured: false
      }
    ]
  },
  {
    title: "Workflow Optimization",
    description: "Streamline your document processing workflows",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    guides: [
      {
        title: "Building Efficient Document Workflows",
        description: "Design workflows that save time and reduce errors in document processing",
        difficulty: "Intermediate",
        readTime: "8 min",
        href: "/guides/document-workflows",
        featured: false
      },
      {
        title: "Quality Control Strategies",
        description: "Implement systematic quality checks for processed documents",
        difficulty: "Intermediate",
        readTime: "6 min",
        href: "/guides/quality-control",
        featured: false
      },
      {
        title: "File Organization Best Practices",
        description: "Organize and manage large collections of digital documents",
        difficulty: "Beginner",
        readTime: "5 min",
        href: "/guides/file-organization",
        featured: false
      }
    ]
  },
  {
    title: "Security & Privacy",
    description: "Protect your documents and maintain privacy",
    icon: Shield,
    color: "from-red-500 to-red-600",
    guides: [
      {
        title: "Digital Document Security Fundamentals",
        description: "Essential security practices for handling sensitive documents",
        difficulty: "Beginner",
        readTime: "7 min",
        href: "/guides/document-security",
        featured: false
      },
      {
        title: "Privacy-First Processing",
        description: "Why client-side processing matters and how it protects you",
        difficulty: "Beginner",
        readTime: "4 min",
        href: "/guides/privacy-first-processing",
        featured: false
      },
      {
        title: "GDPR Compliance for Document Processing",
        description: "Navigate data protection regulations when handling documents",
        difficulty: "Advanced",
        readTime: "13 min",
        href: "/guides/gdpr-compliance",
        featured: false
      }
    ]
  }
];

const quickTips = [
  {
    title: "Reduce PDF Size by 70%",
    tip: "Use image compression settings of 85% quality for photos in PDFs - the difference is barely noticeable but saves massive space.",
    category: "PDF"
  },
  {
    title: "Perfect Web Images",
    tip: "Use WebP format with 80% quality for web images - it's 30% smaller than JPEG with better quality.",
    category: "Images"
  },
  {
    title: "Batch Processing",
    tip: "Process similar files together to maintain consistent quality and settings across your document collection.",
    category: "Workflow"
  },
  {
    title: "Color Space Optimization",
    tip: "Convert RGB images to grayscale when color isn't needed - it can reduce file size by 60-70%.",
    category: "Images"
  }
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 shadow-lg">
              <BookOpen className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground mb-6">
            Complete <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Guides</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Master PDF and image processing with our comprehensive guides. From beginner tutorials to advanced optimization techniques, 
            learn from industry experts and transform your document workflows.
          </p>
        </div>

        {/* Quick Tips Section */}
        <div className="mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Quick Tips</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <div
                key={index}
                className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/40 transition-all duration-300"
                style={{ animationDelay: `${0.2 + index * 0.05}s` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {tip.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Guide Categories */}
        {guideCategories.map((category, categoryIndex) => (
          <section 
            key={category.title} 
            className="mb-20 animate-slide-up" 
            style={{ animationDelay: `${0.3 + categoryIndex * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} shadow-lg`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {category.guides.map((guide, guideIndex) => (
                <article
                  key={guide.title}
                  className={`group relative bg-surface/80 backdrop-blur-sm border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 ${
                    guide.featured ? 'md:col-span-2 lg:col-span-1' : ''
                  }`}
                  style={{ animationDelay: `${0.4 + categoryIndex * 0.1 + guideIndex * 0.05}s` }}
                >
                  {guide.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 text-xs font-bold rounded-full">
                        <Star className="h-3 w-3" />
                        Featured
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {guide.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {guide.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {guide.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {guide.description}
                    </p>
                    
                    <Link
                      href={guide.href}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
                    >
                      Read Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* Learning Path Section */}
        <section className="mb-20 animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Recommended Learning Path</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              New to document processing? Follow this curated path to build your skills progressively.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { step: 1, title: "Start with Image Formats", description: "Understand the basics of JPEG, PNG, and WebP", href: "/blog/image-formats-explained" },
                { step: 2, title: "Learn PDF Optimization", description: "Master the art of reducing PDF file sizes", href: "/blog/pdf-optimization-guide" },
                { step: 3, title: "Explore Advanced Techniques", description: "Dive into batch processing and automation", href: "/guides/batch-pdf-processing" },
                { step: 4, title: "Implement Security Best Practices", description: "Protect your documents and maintain privacy", href: "/guides/document-security" }
              ].map((step, index) => (
                <div key={step.step} className="flex items-center gap-6 p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  <Link
                    href={step.href}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Start
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl border border-primary/20 p-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Join Our Community</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with other document processing enthusiasts, share tips, and get help with your projects. 
            Our community is here to support your learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
            >
              Get Support
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-3 bg-surface/80 border border-border text-foreground font-semibold py-4 px-8 rounded-xl hover:border-primary/40 transition-all duration-300"
            >
              Read Blog
              <BookOpen className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}