import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, BookOpen, Lightbulb, TrendingUp } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata = {
  title: "Blog & Resources",
  description: "Expert guides, tutorials, and tips for PDF and image processing. Learn best practices, optimization techniques, and advanced workflows.",
};

const blogPosts = [
  {
    slug: "pdf-optimization-guide",
    title: "The Complete Guide to PDF Optimization: Reduce File Size Without Losing Quality",
    excerpt: "Learn professional techniques to compress PDFs effectively while maintaining document quality. Discover the science behind PDF compression and when to use different methods.",
    category: "PDF Processing",
    readTime: "8 min read",
    publishDate: "2024-01-15",
    featured: true,
  },
  {
    slug: "image-formats-explained",
    title: "Image Formats Explained: JPEG vs PNG vs WebP - When to Use Each",
    excerpt: "A comprehensive comparison of image formats, their compression algorithms, and optimal use cases. Make informed decisions about image format selection.",
    category: "Image Processing",
    readTime: "6 min read",
    publishDate: "2024-01-12",
    featured: true,
  },
  {
    slug: "pdf-accessibility-best-practices",
    title: "Creating Accessible PDFs: A Complete Guide for Better Document Design",
    excerpt: "Learn how to create PDFs that are accessible to users with disabilities. Understand WCAG guidelines and implement best practices for inclusive document design.",
    category: "Accessibility",
    readTime: "10 min read",
    publishDate: "2024-01-10",
    featured: false,
  },
  {
    slug: "batch-processing-workflows",
    title: "Efficient Batch Processing Workflows for Large Document Collections",
    excerpt: "Streamline your document processing with proven batch workflow strategies. Learn automation techniques and time-saving tips for handling multiple files.",
    category: "Productivity",
    readTime: "7 min read",
    publishDate: "2024-01-08",
    featured: false,
  },
  {
    slug: "digital-document-security",
    title: "Digital Document Security: Protecting Your Files in the Modern Age",
    excerpt: "Understand the security implications of online document processing and learn how to protect sensitive information while maintaining productivity.",
    category: "Security",
    readTime: "9 min read",
    publishDate: "2024-01-05",
    featured: false,
  },
  {
    slug: "image-compression-algorithms",
    title: "Understanding Image Compression: Lossy vs Lossless Algorithms Explained",
    excerpt: "Dive deep into the mathematics and computer science behind image compression. Learn how different algorithms work and their impact on image quality.",
    category: "Technical",
    readTime: "12 min read",
    publishDate: "2024-01-03",
    featured: false,
  },
  {
    slug: "common-pdf-problems-solutions",
    title: "10 Common PDF Problems and How to Fix Them",
    excerpt: "Solve the most frustrating PDF issues with our comprehensive troubleshooting guide. From corrupted files to formatting problems, we have the solutions.",
    category: "PDF Processing",
    readTime: "12 min read",
    publishDate: "2024-03-20",
    featured: true,
  },
  {
    slug: "social-media-image-optimization",
    title: "Social Media Image Optimization: Complete Guide for 2024",
    excerpt: "Master social media image optimization with our comprehensive guide. Learn the perfect dimensions, formats, and compression techniques for every platform.",
    category: "Image Processing",
    readTime: "15 min read",
    publishDate: "2024-03-22",
    featured: true,
  },
  {
    slug: "remote-work-document-security",
    title: "Document Security in Remote Work: Essential Best Practices for 2024",
    excerpt: "Protect sensitive documents while working remotely. Learn essential security practices, tools, and strategies to keep your business data safe from anywhere.",
    category: "Security",
    readTime: "14 min read",
    publishDate: "2024-03-25",
    featured: false,
  },
];

// Generate categories based on actual posts to avoid 404s
const categories = (() => {
  const categoryMap = new Map();
  const categoryColors = {
    "PDF Processing": "bg-blue-500",
    "Image Processing": "bg-green-500", 
    "Productivity": "bg-purple-500",
    "Security": "bg-red-500",
    "Accessibility": "bg-orange-500",
    "Technical": "bg-indigo-500"
  };
  
  // Count actual posts per category
  blogPosts.forEach(post => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });
  
  // Convert to array with colors
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
    color: categoryColors[name as keyof typeof categoryColors] || "bg-gray-500"
  }));
})();

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

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
            Blog & <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Resources</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Expert guides, tutorials, and insights to help you master PDF and image processing. 
            Learn best practices, discover optimization techniques, and stay updated with the latest trends.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`}
                className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-surface/80 border border-border hover:border-primary/40 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </span>
                <span className="text-sm text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Posts */}
        <div className="mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group relative bg-surface/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover-lift-glow"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
                    >
                      Read More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-8">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Latest Articles</h2>
          </div>
          <div className="grid gap-6">
            {regularPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group flex flex-col md:flex-row gap-6 p-6 bg-surface/80 backdrop-blur-sm border border-border rounded-xl hover:border-primary/40 transition-all duration-300"
                style={{ animationDelay: `${0.5 + index * 0.05}s` }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-3 py-1 text-sm font-medium bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
                    >
                      Read Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <NewsletterSignup 
          title="Stay Updated"
          description="Get the latest tutorials, tips, and insights delivered to your inbox. Join our community of file processing enthusiasts."
          className="mt-20 animate-slide-up"
        />
      </div>
    </div>
  );
}