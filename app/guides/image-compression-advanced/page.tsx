import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Image, Zap, Settings, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Advanced Image Compression Techniques | Expert Guide",
  description: "Master advanced image compression algorithms, quality optimization, and format selection for professional workflows. Comprehensive guide to image optimization.",
  keywords: ["image compression", "image optimization", "compression algorithms", "image quality", "file size reduction"],
};

export default function AdvancedImageCompressionPage() {
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
                <Image className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-full">
                Advanced
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Advanced Image Compression Techniques
            </h1>
            <p className="text-xl text-muted-foreground">
              Master professional image compression algorithms, quality optimization strategies, and format selection for maximum efficiency.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Compression Impact
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Advanced compression techniques can reduce image file sizes by 60-90% while maintaining visual quality, dramatically improving website performance and user experience.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Compression Algorithms</h2>
          
          <p className="text-muted-foreground mb-6">
            Image compression involves reducing file size by removing redundant or less important visual information. Understanding different algorithms helps you choose the best approach for each use case.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Lossy vs Lossless Compression</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">Lossy Compression</h4>
              <ul className="text-red-800 dark:text-red-200 space-y-2 text-sm">
                <li>• Permanently removes image data</li>
                <li>• Achieves higher compression ratios</li>
                <li>• Best for photos and complex images</li>
                <li>• Examples: JPEG, WebP lossy</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Lossless Compression</h4>
              <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
                <li>• Preserves all original image data</li>
                <li>• Lower compression ratios</li>
                <li>• Best for graphics and text</li>
                <li>• Examples: PNG, WebP lossless</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Advanced Compression Techniques</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Perceptual Quality Optimization</h3>
          
          <p className="text-muted-foreground mb-4">
            Advanced algorithms analyze human visual perception to optimize compression:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                title: "Psychovisual Modeling",
                description: "Removes information that human eyes are less likely to notice, such as high-frequency details in bright areas."
              },
              {
                title: "Adaptive Quality",
                description: "Applies different compression levels to different regions based on visual importance and complexity."
              },
              {
                title: "Edge Preservation",
                description: "Maintains sharp edges and important details while aggressively compressing smooth areas."
              },
              {
                title: "Color Space Optimization",
                description: "Leverages human color perception differences to reduce color information without visible quality loss."
              }
            ].map((technique, index) => (
              <div key={index} className="flex gap-4 p-4 bg-surface/50 rounded-lg border border-border">
                <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{technique.title}</h4>
                  <p className="text-muted-foreground">{technique.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Modern Compression Standards</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                format: "WebP",
                compression: "25-35% better than JPEG",
                description: "Google's modern format with excellent lossy and lossless compression"
              },
              {
                format: "AVIF",
                compression: "50% better than JPEG",
                description: "Next-generation format based on AV1 video codec with superior compression"
              },
              {
                format: "HEIF/HEIC",
                compression: "50% better than JPEG",
                description: "Apple's format offering excellent compression with advanced features"
              },
              {
                format: "JPEG XL",
                compression: "60% better than JPEG",
                description: "Royalty-free format designed as JPEG successor with backward compatibility"
              }
            ].map((format, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{format.format}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {format.compression}
                  </span>
                </div>
                <p className="text-muted-foreground">{format.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Quality Assessment Methods</h2>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Objective Quality Metrics</h3>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>PSNR (Peak Signal-to-Noise Ratio):</strong> Measures pixel-level differences between original and compressed images</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>SSIM (Structural Similarity Index):</strong> Evaluates structural information preservation and perceptual quality</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground"><strong>VMAF (Video Multi-Method Assessment Fusion):</strong> Netflix's perceptual quality metric for modern content</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">Subjective Quality Evaluation</h3>
          
          <p className="text-muted-foreground mb-6">
            While metrics provide objective measurements, human visual assessment remains crucial for determining acceptable quality levels for specific use cases and target audiences.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Optimization Strategies</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">Content-Aware Compression</h3>
          
          <p className="text-muted-foreground mb-4">
            Different image types require different optimization approaches:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                type: "Photographs",
                strategy: "Aggressive lossy compression with perceptual optimization"
              },
              {
                type: "Graphics & Logos",
                strategy: "Lossless compression or high-quality lossy with edge preservation"
              },
              {
                type: "Screenshots",
                strategy: "Format selection based on content complexity and color count"
              },
              {
                type: "Artwork",
                strategy: "Balanced approach preserving artistic intent and color accuracy"
              }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{item.type}</h4>
                <p className="text-muted-foreground text-sm">{item.strategy}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Progressive Enhancement</h3>
          
          <p className="text-muted-foreground mb-4">
            Implement progressive loading strategies for better user experience:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Progressive JPEG for gradual image loading</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Low-quality image placeholders (LQIP)</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Responsive images with multiple quality levels</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Lazy loading for off-screen images</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Implementation Best Practices</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Compression Workflow
            </h3>
            <ol className="text-green-800 dark:text-green-200 space-y-2">
              <li>1. Analyze image content and intended use</li>
              <li>2. Select appropriate format and compression method</li>
              <li>3. Apply content-aware optimization settings</li>
              <li>4. Test quality across different devices and viewing conditions</li>
              <li>5. Validate file size reduction and loading performance</li>
              <li>6. Implement fallbacks for browser compatibility</li>
            </ol>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">Performance Considerations</h3>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Balance compression time vs. file size reduction</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Consider decode performance on target devices</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Implement caching strategies for processed images</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Monitor real-world performance metrics</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Future of Image Compression</h2>
          
          <p className="text-muted-foreground mb-4">
            Emerging technologies and techniques continue to push compression boundaries:
          </p>

          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">AI-powered compression algorithms</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Neural network-based quality enhancement</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Adaptive streaming for images</span>
            </li>
            <li className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Context-aware compression optimization</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Advanced image compression requires understanding both technical algorithms and human visual perception. By applying these techniques thoughtfully, you can achieve significant file size reductions while maintaining excellent visual quality.
          </p>

          <p className="text-muted-foreground">
            Stay updated with emerging formats and techniques, but always test thoroughly with your specific content and target audience to ensure optimal results.
          </p>
        </article>
      </div>
    </div>
  );
}