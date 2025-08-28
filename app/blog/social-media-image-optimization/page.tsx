import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Clock, Instagram, Facebook, Twitter, Linkedin, TrendingUp, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Social Media Image Optimization: Complete Guide for 2024",
  description: "Master social media image optimization with our comprehensive guide. Learn the perfect dimensions, formats, and compression techniques for every platform.",
  keywords: ["social media images", "image optimization", "Instagram images", "Facebook images", "Twitter images", "LinkedIn images", "social media marketing"],
};

export default function SocialMediaImageOptimizationPage() {
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
              Social Media Image Optimization: Complete Guide for 2024
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>March 22, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>JaeyGuides Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>15 min read</span>
              </div>
            </div>

            <p className="text-xl text-muted-foreground">
              In the visual-first world of social media, image quality can make or break your content's performance. From Instagram's square posts to LinkedIn's professional banners, each platform has unique requirements that demand specific optimization strategies. This comprehensive guide will help you create stunning, fast-loading images that engage your audience across all social platforms.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Why Image Optimization Matters
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Optimized images load 3x faster, increase engagement by 650%, and improve your content's reach through platform algorithms. Poor image quality can cost you followers and reduce your content's visibility.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Social Media Image Requirements</h2>
          
          <p className="text-muted-foreground mb-6">
            Each social media platform has evolved its own image standards based on user behavior, device usage, and technical constraints. Understanding these requirements is the first step to creating content that looks professional and performs well.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Key Optimization Factors</h3>
          
          <div className="grid gap-4 mb-8">
            {[
              {
                factor: "Dimensions & Aspect Ratios",
                description: "Each platform favors specific dimensions for optimal display and engagement",
                importance: "Critical for proper display and algorithm preference"
              },
              {
                factor: "File Size & Loading Speed",
                description: "Smaller files load faster, improving user experience and engagement rates",
                importance: "Affects reach and user retention"
              },
              {
                factor: "Image Quality & Compression",
                description: "Balance between visual appeal and file size optimization",
                importance: "Determines professional appearance and loading performance"
              },
              {
                factor: "Format Selection",
                description: "JPEG vs PNG vs WebP - choosing the right format for each use case",
                importance: "Impacts file size, quality, and compatibility"
              }
            ].map((factor, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{factor.factor}</h4>
                <p className="text-muted-foreground mb-2">{factor.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Why it matters:</strong> {factor.importance}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Platform-Specific Optimization Guide</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Instagram Optimization</h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Instagram className="h-6 w-6 text-purple-600" />
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Instagram Image Specs</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Feed Posts</h5>
                <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-sm">
                  <li>• Square: 1080 x 1080px (1:1)</li>
                  <li>• Portrait: 1080 x 1350px (4:5)</li>
                  <li>• Landscape: 1080 x 566px (1.91:1)</li>
                  <li>• Max file size: 30MB</li>
                  <li>• Format: JPEG, PNG</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Stories & Reels</h5>
                <ul className="text-purple-700 dark:text-purple-300 space-y-1 text-sm">
                  <li>• Stories: 1080 x 1920px (9:16)</li>
                  <li>• Reels: 1080 x 1920px (9:16)</li>
                  <li>• Profile picture: 320 x 320px</li>
                  <li>• IGTV cover: 420 x 654px</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-surface/50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-foreground mb-4">Instagram Optimization Tips:</h4>
            <div className="space-y-3">
              <div className="flex gap-4">
                <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Use our image resizer</p>
                  <p className="text-muted-foreground text-sm">Perfect your Instagram dimensions with our <Link href="/image/resize" className="text-primary hover:underline">image resize tool</Link> for professional-looking posts.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Compress for faster loading</p>
                  <p className="text-muted-foreground text-sm">Use our <Link href="/image/compress" className="text-primary hover:underline">image compressor</Link> to reduce file sizes while maintaining Instagram's visual standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <TrendingUp className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Optimize for mobile viewing</p>
                  <p className="text-muted-foreground text-sm">90% of Instagram users are on mobile. Ensure text is readable and important elements are clearly visible on small screens.</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Facebook Optimization</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Facebook className="h-6 w-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Facebook Image Specs</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Posts & Ads</h5>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Shared images: 1200 x 630px</li>
                  <li>• Link previews: 1200 x 630px</li>
                  <li>• Event cover: 1920 x 1005px</li>
                  <li>• Max file size: 4MB</li>
                  <li>• Format: JPEG, PNG</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Profile & Cover</h5>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Profile picture: 180 x 180px</li>
                  <li>• Cover photo: 820 x 312px</li>
                  <li>• Stories: 1080 x 1920px</li>
                  <li>• Group cover: 1640 x 856px</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Twitter/X Optimization</h3>
          
          <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Twitter className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Twitter/X Image Specs</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Posts & Cards</h5>
                <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li>• Single image: 1200 x 675px</li>
                  <li>• Multiple images: 700 x 800px</li>
                  <li>• Twitter cards: 1200 x 628px</li>
                  <li>• Max file size: 5MB</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Profile Elements</h5>
                <ul className="text-gray-700 dark:text-gray-300 space-y-1 text-sm">
                  <li>• Profile picture: 400 x 400px</li>
                  <li>• Header image: 1500 x 500px</li>
                  <li>• In-stream photo: 1024 x 512px</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">LinkedIn Optimization</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Linkedin className="h-6 w-6 text-blue-600" />
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">LinkedIn Image Specs</h4>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Posts & Articles</h5>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Shared content: 1200 x 627px</li>
                  <li>• Single image post: 1080 x 1080px</li>
                  <li>• Article header: 1280 x 720px</li>
                  <li>• Max file size: 5MB</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Profile & Company</h5>
                <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                  <li>• Profile picture: 400 x 400px</li>
                  <li>• Cover photo: 1584 x 396px</li>
                  <li>• Company logo: 300 x 300px</li>
                  <li>• Company cover: 1128 x 191px</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Advanced Optimization Techniques</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Compression Strategies by Content Type</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                type: "Photography & Realistic Images",
                format: "JPEG",
                quality: "80-90%",
                tips: "Use JPEG for photos with many colors and gradients. Higher quality for hero images, moderate for supporting content."
              },
              {
                type: "Graphics, Logos & Text",
                format: "PNG",
                quality: "Lossless",
                tips: "PNG preserves sharp edges and text clarity. Use for logos, infographics, and images with transparency."
              },
              {
                type: "Simple Graphics & Icons",
                format: "WebP",
                quality: "80-95%",
                tips: "WebP offers superior compression for modern browsers. 25-35% smaller than equivalent JPEG/PNG."
              },
              {
                type: "Animated Content",
                format: "GIF/MP4",
                quality: "Optimized",
                tips: "Use MP4 for better compression than GIF. Keep animations under 15MB for social media."
              }
            ].map((strategy, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{strategy.type}</h4>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      {strategy.format}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded">
                      {strategy.quality}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{strategy.tips}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Mobile-First Optimization</h3>
          
          <p className="text-muted-foreground mb-4">
            With 80%+ of social media consumption happening on mobile devices, mobile optimization is crucial:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Visual Considerations</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Use larger fonts (minimum 14px)</li>
                <li>• Ensure high contrast for readability</li>
                <li>• Place key elements in the center</li>
                <li>• Avoid fine details that disappear on small screens</li>
                <li>• Test on actual mobile devices</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Technical Optimization</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Target file sizes under 1MB for fast loading</li>
                <li>• Use progressive JPEG for large images</li>
                <li>• Optimize for 3G/4G network speeds</li>
                <li>• Consider data usage in developing markets</li>
                <li>• Test loading times on slower connections</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Automation and Workflow Optimization</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Batch Processing for Social Media</h3>
          
          <p className="text-muted-foreground mb-4">
            Creating content for multiple platforms requires efficient workflows:
          </p>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Efficient Social Media Workflow
            </h4>
            <ol className="text-green-800 dark:text-green-200 space-y-2">
              <li>1. Create master image at highest required resolution</li>
              <li>2. Use our batch resize tool for platform-specific dimensions</li>
              <li>3. Apply platform-appropriate compression settings</li>
              <li>4. Test images on actual devices and platforms</li>
              <li>5. Store optimized versions in organized folders</li>
              <li>6. Create templates for consistent branding</li>
            </ol>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Quality Control Checklist</h3>
          
          <div className="space-y-3 mb-8">
            {[
              "Image displays correctly on mobile and desktop",
              "Text is readable at actual viewing size",
              "File size is under platform limits",
              "Colors appear consistent across devices",
              "Important elements aren't cropped by platform interfaces",
              "Loading time is under 3 seconds on mobile",
              "Image maintains quality after platform compression"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded border-2 border-primary/30 mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Performance Monitoring and Analytics</h2>
          
          <p className="text-muted-foreground mb-4">
            Track how your optimized images perform to continuously improve your strategy:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                metric: "Engagement Rate",
                description: "Likes, comments, shares relative to reach",
                target: "2-5% average across platforms"
              },
              {
                metric: "Click-Through Rate",
                description: "Clicks on images with links",
                target: "1-3% for social media posts"
              },
              {
                metric: "Loading Time",
                description: "Time for image to fully load",
                target: "Under 3 seconds on mobile"
              },
              {
                metric: "Bounce Rate",
                description: "Users leaving after viewing image",
                target: "Under 60% for linked content"
              }
            ].map((metric, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{metric.metric}</h4>
                <p className="text-muted-foreground text-sm mb-2">{metric.description}</p>
                <p className="text-xs text-muted-foreground/80"><strong>Target:</strong> {metric.target}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Future-Proofing Your Image Strategy</h2>
          
          <p className="text-muted-foreground mb-4">
            Social media platforms constantly evolve. Stay ahead with these strategies:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Monitor platform updates and new image requirements</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Experiment with emerging formats like WebP and AVIF</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Prepare for new platforms and changing user behaviors</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Invest in scalable workflows and automation tools</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Social media image optimization is both an art and a science. While technical specifications provide the foundation, understanding your audience and platform algorithms helps you create images that not only look great but also perform well.
          </p>

          <p className="text-muted-foreground mb-6">
            The key is finding the right balance between visual quality, file size, and loading performance. With the right tools and techniques, you can create stunning social media content that engages your audience and drives results.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Ready to Optimize Your Social Media Images?
            </h4>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              Use our professional image optimization tools to create perfect social media content. Resize, compress, and convert your images for maximum impact across all platforms.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/image/resize"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Resize Images
              </Link>
              <Link
                href="/image/compress"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                Compress Images
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}