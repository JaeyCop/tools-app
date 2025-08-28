import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, Zap, Smartphone, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Web Image Optimization | Complete Performance Guide",
  description: "Master web image optimization for faster loading times and better user experience. Learn responsive images, modern formats, and performance techniques.",
  keywords: ["web image optimization", "responsive images", "image performance", "web vitals", "lazy loading"],
};

export default function WebImageOptimizationPage() {
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
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                Intermediate
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Web Image Optimization
            </h1>
            <p className="text-xl text-muted-foreground">
              Optimize images for web performance with modern formats, responsive techniques, and loading strategies that improve Core Web Vitals.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  Performance Impact
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Proper image optimization can reduce page load times by 50-80% and significantly improve Core Web Vitals scores, leading to better SEO rankings and user experience.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Web Image Performance</h2>
          
          <p className="text-muted-foreground mb-6">
            Images typically account for 60-70% of a webpage's total size. Optimizing them is crucial for fast loading times, better user experience, and improved search engine rankings.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Core Web Vitals Impact</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              {
                metric: "LCP",
                name: "Largest Contentful Paint",
                impact: "Large images often are the LCP element"
              },
              {
                metric: "CLS",
                name: "Cumulative Layout Shift",
                impact: "Images without dimensions cause layout shifts"
              },
              {
                metric: "FID",
                name: "First Input Delay",
                impact: "Heavy image processing can block main thread"
              }
            ].map((vital, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="text-center mb-2">
                  <span className="px-3 py-1 text-sm font-bold bg-primary/10 text-primary rounded-full">
                    {vital.metric}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-center">{vital.name}</h4>
                <p className="text-muted-foreground text-sm text-center">{vital.impact}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Modern Image Formats</h2>
          
          <p className="text-muted-foreground mb-4">
            Choosing the right image format is crucial for optimal web performance:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                format: "WebP",
                compression: "25-35% smaller than JPEG",
                support: "96% browser support",
                description: "Excellent balance of compression and compatibility",
                bestFor: "Most web images, replacing JPEG and PNG"
              },
              {
                format: "AVIF",
                compression: "50% smaller than JPEG",
                support: "85% browser support",
                description: "Superior compression with excellent quality",
                bestFor: "High-quality images where file size matters"
              },
              {
                format: "JPEG XL",
                compression: "60% smaller than JPEG",
                support: "Limited support",
                description: "Next-generation format with backward compatibility",
                bestFor: "Future-proofing, progressive enhancement"
              },
              {
                format: "SVG",
                compression: "Vector-based",
                support: "Universal support",
                description: "Scalable vector graphics for icons and simple images",
                bestFor: "Icons, logos, simple graphics"
              }
            ].map((format, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{format.format}</h4>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                      {format.compression}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded">
                      {format.support}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">{format.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Best for:</strong> {format.bestFor}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Responsive Images</h2>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">The Picture Element</h3>
          
          <p className="text-muted-foreground mb-4">
            Use the picture element for art direction and format fallbacks:
          </p>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
            <code className="text-sm text-foreground">
              {`<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" 
       width="800" height="600"
       loading="lazy">
</picture>`}
            </code>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Srcset and Sizes</h3>
          
          <p className="text-muted-foreground mb-4">
            Provide multiple image resolutions for different screen densities and viewport sizes:
          </p>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
            <code className="text-sm text-foreground">
              {`<img src="image-800w.jpg"
     srcset="image-400w.jpg 400w,
             image-800w.jpg 800w,
             image-1200w.jpg 1200w"
     sizes="(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw"
     alt="Description"
     width="800" height="600"
     loading="lazy">`}
            </code>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Loading Strategies</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Lazy Loading</h3>
          
          <p className="text-muted-foreground mb-4">
            Load images only when they're about to enter the viewport:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use native loading="lazy" attribute for modern browsers</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement Intersection Observer for custom lazy loading</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Always eager load above-the-fold images</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Provide fallback for browsers without lazy loading support</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Progressive Loading</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                technique: "Low Quality Image Placeholders (LQIP)",
                description: "Show a blurred, low-quality version while the full image loads"
              },
              {
                technique: "Solid Color Placeholders",
                description: "Use the dominant color of the image as a placeholder background"
              },
              {
                technique: "SVG Placeholders",
                description: "Generate geometric SVG patterns based on image characteristics"
              },
              {
                technique: "Progressive JPEG",
                description: "Load images in multiple passes, improving perceived performance"
              }
            ].map((technique, index) => (
              <div key={index} className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
                <Smartphone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{technique.technique}</h4>
                  <p className="text-muted-foreground">{technique.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Image Optimization Techniques</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Compression Strategies</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use quality settings between 75-85 for JPEG images</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Remove unnecessary metadata and color profiles</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Optimize PNG images with tools like OptiPNG or TinyPNG</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use appropriate color depth (8-bit vs 24-bit)</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Sizing and Scaling</h3>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Image Sizing Best Practices
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• Never serve images larger than their display size</li>
              <li>• Provide 2x versions for high-DPI displays</li>
              <li>• Use CSS to control display size, not HTML attributes</li>
              <li>• Consider bandwidth constraints on mobile devices</li>
              <li>• Test on various screen sizes and resolutions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Performance Monitoring</h2>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Key Metrics to Track</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              "Image load time and file sizes",
              "Core Web Vitals scores",
              "Bandwidth usage by image type",
              "Cache hit rates for images",
              "Mobile vs desktop performance",
              "User engagement with image-heavy pages"
            ].map((metric, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg border border-border">
                <TrendingUp className="h-4 w-4 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground text-sm">{metric}</span>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Tools for Optimization</h3>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Google PageSpeed Insights for performance analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">WebPageTest for detailed waterfall analysis</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Lighthouse for Core Web Vitals monitoring</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">ImageOptim, Squoosh, or TinyPNG for compression</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Advanced Techniques</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Content Delivery Networks (CDNs)</h3>
          
          <p className="text-muted-foreground mb-4">
            Use image CDNs for automatic optimization and global delivery:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Automatic format selection based on browser support</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Real-time image resizing and optimization</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Global edge caching for faster delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Analytics and performance insights</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Client Hints</h3>
          
          <p className="text-muted-foreground mb-6">
            Use client hints to automatically serve optimized images based on device capabilities and network conditions.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Checklist</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Web Image Optimization Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Choose appropriate image formats (WebP, AVIF)</li>
              <li>✓ Implement responsive images with srcset and sizes</li>
              <li>✓ Use lazy loading for below-the-fold images</li>
              <li>✓ Optimize image compression and quality settings</li>
              <li>✓ Provide proper width and height attributes</li>
              <li>✓ Implement progressive loading techniques</li>
              <li>✓ Monitor Core Web Vitals and performance metrics</li>
              <li>✓ Test on various devices and network conditions</li>
              <li>✓ Consider using an image CDN for advanced optimization</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Web image optimization is crucial for modern web performance. By implementing these techniques, you can significantly improve loading times, user experience, and search engine rankings while reducing bandwidth costs.
          </p>

          <p className="text-muted-foreground">
            Start with the basics like format selection and compression, then gradually implement more advanced techniques like responsive images and lazy loading. Regular monitoring and testing ensure your optimizations continue to deliver results as your site evolves.
          </p>
        </article>
      </div>
    </div>
  );
}