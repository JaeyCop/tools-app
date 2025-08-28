import { Calendar, Clock, User, Share2, BookOpen, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, Image, Zap, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Image Formats Explained: JPEG vs PNG vs WebP - When to Use Each",
  description: "A comprehensive comparison of image formats, their compression algorithms, and optimal use cases. Make informed decisions about image format selection for web and print.",
  keywords: ["image formats", "JPEG vs PNG", "WebP", "image compression", "web optimization", "image quality"],
};

export default function ImageFormatsExplained() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <article className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Article Header */}
        <header className="mb-12 animate-slide-up">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span>Image Processing</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Image Formats Explained: JPEG vs PNG vs WebP - When to Use Each
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>January 12, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>6 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>JaeyGuides Team</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full border border-secondary/20 font-medium">
              Image Processing
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-surface/80 border border-border rounded-full hover:border-primary/40 transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </header>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Introduction */}
          <div className="bg-gradient-to-r from-secondary/5 via-primary/5 to-accent/5 rounded-2xl border border-secondary/20 p-8 mb-12">
            <div className="flex items-start gap-4">
              <Image className="h-8 w-8 text-secondary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 mt-0">The Format Decision Matrix</h2>
                <p className="text-muted-foreground mb-4">
                  Choosing the right image format can reduce file sizes by 50-90% while maintaining visual quality. This guide breaks down the science behind each format and provides clear decision criteria for every use case.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-secondary mb-1">JPEG</div>
                    <div className="text-sm text-muted-foreground">Photos & Complex Images</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-primary mb-1">PNG</div>
                    <div className="text-sm text-muted-foreground">Graphics & Transparency</div>
                  </div>
                  <div className="text-center p-4 bg-background/50 rounded-xl">
                    <div className="text-2xl font-bold text-accent mb-1">WebP</div>
                    <div className="text-sm text-muted-foreground">Modern Web Standard</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* JPEG Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-secondary/10 rounded-xl border border-secondary/20">
                <div className="w-8 h-8 bg-secondary rounded text-white flex items-center justify-center font-bold">J</div>
              </div>
              <h2 className="text-3xl font-bold text-foreground">JPEG: The Photography Standard</h2>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              JPEG (Joint Photographic Experts Group) revolutionized digital photography by making high-quality images practical for storage and transmission. Its lossy compression algorithm is specifically designed for photographic content.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Strengths
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Excellent compression for photographic images</li>
                  <li>• Universal browser and device support</li>
                  <li>• Small file sizes with acceptable quality loss</li>
                  <li>• Adjustable quality settings (1-100)</li>
                  <li>• Progressive loading support</li>
                  <li>• EXIF metadata preservation</li>
                </ul>
              </div>
              
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Limitations
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• No transparency support</li>
                  <li>• Quality degradation with each edit/save</li>
                  <li>• Poor performance on graphics with sharp edges</li>
                  <li>• Visible artifacts at low quality settings</li>
                  <li>• Limited color depth (8-bit per channel)</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">How JPEG Compression Works</h4>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                JPEG uses Discrete Cosine Transform (DCT) to convert image data into frequency components. It then quantizes these frequencies, removing high-frequency details that are less perceptible to human vision.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                  <div className="font-semibold text-blue-800 dark:text-blue-200">Step 1</div>
                  <div className="text-blue-600 dark:text-blue-300">Color Space Conversion</div>
                </div>
                <div className="text-center p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                  <div className="font-semibold text-blue-800 dark:text-blue-200">Step 2</div>
                  <div className="text-blue-600 dark:text-blue-300">DCT Transformation</div>
                </div>
                <div className="text-center p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
                  <div className="font-semibold text-blue-800 dark:text-blue-200">Step 3</div>
                  <div className="text-blue-600 dark:text-blue-300">Quantization & Encoding</div>
                </div>
              </div>
            </div>

            <div className="bg-surface/80 border border-border rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-4">Best Use Cases for JPEG</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-foreground mb-2">Perfect For:</h5>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Digital photography</li>
                    <li>• Social media images</li>
                    <li>• Website hero images</li>
                    <li>• Email attachments</li>
                    <li>• Print materials (magazines, brochures)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-foreground mb-2">Avoid For:</h5>
                  <ul className="space-y-1 text-muted-foreground text-sm">
                    <li>• Logos and icons</li>
                    <li>• Screenshots with text</li>
                    <li>• Images requiring transparency</li>
                    <li>• Simple graphics with few colors</li>
                    <li>• Images that will be edited multiple times</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* PNG Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                <div className="w-8 h-8 bg-primary rounded text-white flex items-center justify-center font-bold">P</div>
              </div>
              <h2 className="text-3xl font-bold text-foreground">PNG: The Graphics Champion</h2>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              PNG (Portable Network Graphics) was designed as a patent-free replacement for GIF, offering lossless compression and full transparency support. It excels at preserving sharp edges and exact colors.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Strengths
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Lossless compression preserves exact quality</li>
                  <li>• Full alpha transparency support</li>
                  <li>• Excellent for graphics and text</li>
                  <li>• No quality loss during editing</li>
                  <li>• Wide color depth support (up to 16-bit)</li>
                  <li>• Gamma correction information</li>
                </ul>
              </div>
              
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Limitations
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Larger file sizes for photographic content</li>
                  <li>• No native animation support</li>
                  <li>• Limited metadata support</li>
                  <li>• Can be overkill for simple web graphics</li>
                  <li>• Slower compression/decompression</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h4 className="font-semibold text-foreground mb-4">PNG Variants Explained</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-12 bg-gradient-to-r from-gray-300 to-gray-500 rounded flex items-center justify-center text-white font-bold text-xs">PNG-8</div>
                    <div>
                      <h5 className="font-medium text-foreground">PNG-8 (Indexed Color)</h5>
                      <p className="text-muted-foreground text-sm">Up to 256 colors, smaller file sizes, similar to GIF but with better compression.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-12 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center text-white font-bold text-xs">PNG-24</div>
                    <div>
                      <h5 className="font-medium text-foreground">PNG-24 (True Color)</h5>
                      <p className="text-muted-foreground text-sm">16.7 million colors, no transparency, best for high-quality graphics without alpha channel.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-12 bg-gradient-to-r from-accent to-primary rounded flex items-center justify-center text-white font-bold text-xs">PNG-32</div>
                    <div>
                      <h5 className="font-medium text-foreground">PNG-32 (True Color + Alpha)</h5>
                      <p className="text-muted-foreground text-sm">16.7 million colors plus full transparency, largest file sizes but maximum quality and flexibility.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* WebP Section */}
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-accent/10 rounded-xl border border-accent/20">
                <div className="w-8 h-8 bg-accent rounded text-white flex items-center justify-center font-bold">W</div>
              </div>
              <h2 className="text-3xl font-bold text-foreground">WebP: The Modern Solution</h2>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              WebP, developed by Google, combines the best of JPEG and PNG while offering superior compression. It supports both lossy and lossless compression, transparency, and animation in a single format.
            </p>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Performance Impact</h4>
                  <p className="text-green-700 dark:text-green-300 mb-3">
                    WebP typically achieves 25-50% smaller file sizes compared to JPEG and PNG while maintaining equivalent visual quality.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">vs JPEG:</div>
                      <div className="text-green-600 dark:text-green-300">25-35% smaller</div>
                    </div>
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">vs PNG:</div>
                      <div className="text-green-600 dark:text-green-300">26-50% smaller</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Advantages
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Superior compression efficiency</li>
                  <li>• Both lossy and lossless modes</li>
                  <li>• Full transparency support</li>
                  <li>• Animation capabilities</li>
                  <li>• Better quality at smaller sizes</li>
                  <li>• Modern compression algorithms</li>
                </ul>
              </div>
              
              <div className="bg-surface/80 border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Considerations
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Limited support in older browsers</li>
                  <li>• Requires fallback strategies</li>
                  <li>• Slower encoding/decoding than JPEG</li>
                  <li>• Less familiar to non-technical users</li>
                  <li>• Not supported by all image editors</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Decision Matrix */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">The Decision Matrix: Choosing the Right Format</h2>
            
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse bg-surface/80 border border-border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-background/50">
                    <th className="text-left p-4 font-semibold text-foreground border-b border-border">Use Case</th>
                    <th className="text-center p-4 font-semibold text-secondary border-b border-border">JPEG</th>
                    <th className="text-center p-4 font-semibold text-primary border-b border-border">PNG</th>
                    <th className="text-center p-4 font-semibold text-accent border-b border-border">WebP</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="p-4 font-medium text-foreground border-b border-border/50">Photographs</td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-red-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground border-b border-border/50">Logos & Icons</td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-red-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground border-b border-border/50">Transparency Needed</td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-red-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground border-b border-border/50">Web Performance Critical</td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center border-b border-border/50">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Maximum Compatibility</td>
                    <td className="p-4 text-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full mx-auto"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Excellent Choice</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Good with Considerations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Not Recommended</span>
              </div>
            </div>
          </section>

          {/* Try Our Tools */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-secondary/10 via-primary/10 to-accent/10 border border-secondary/20 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Convert Between Formats</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Put your format knowledge into practice with our free image conversion tools. Convert between JPEG, PNG, and WebP with optimal quality settings.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/image/convert"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-secondary/30 transition-all duration-300 transform hover:scale-105"
                >
                  Convert Images
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/image/compress"
                  className="inline-flex items-center gap-3 bg-surface/80 border border-border text-foreground font-semibold py-3 px-6 rounded-xl hover:border-primary/40 transition-all duration-300"
                >
                  Compress Images
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Making the Right Choice</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Understanding image formats empowers you to make informed decisions that balance quality, file size, and compatibility. While JPEG remains the standard for photography and PNG excels for graphics, WebP represents the future of web images with its superior compression and feature set.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The key is matching the format to your specific use case. Consider your audience's browser support, the importance of file size, and whether you need features like transparency or animation. With this knowledge, you can optimize your images for the best possible user experience.
            </p>
          </section>
        </div>

        {/* Related Articles */}
        <footer className="mt-16 pt-8 border-t border-border animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/pdf-optimization-guide" className="group p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                The Complete Guide to PDF Optimization
              </h4>
              <p className="text-muted-foreground text-sm">
                Learn professional techniques to compress PDFs effectively while maintaining quality.
              </p>
            </Link>
            
            <Link href="/blog/image-compression-algorithms" className="group p-6 bg-surface/80 border border-border rounded-xl hover:border-primary/40 transition-all duration-300">
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                Understanding Image Compression Algorithms
              </h4>
              <p className="text-muted-foreground text-sm">
                Dive deep into the mathematics behind lossy and lossless compression.
              </p>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}