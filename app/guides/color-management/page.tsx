import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Palette, Monitor, Eye, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Color Management for Digital Documents | Professional Guide",
  description: "Master color management principles for consistent color reproduction across devices and media. Learn about color spaces, profiles, and calibration.",
  keywords: ["color management", "color spaces", "ICC profiles", "color calibration", "color accuracy"],
};

export default function ColorManagementPage() {
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
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded-full">
                Intermediate
              </span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Color Management for Digital Documents
            </h1>
            <p className="text-xl text-muted-foreground">
              Achieve consistent and accurate color reproduction across all devices and output media with professional color management techniques.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Eye className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Why Color Management Matters
                </h3>
                <p className="text-purple-800 dark:text-purple-200">
                  Without proper color management, the same image can look dramatically different on various devices, leading to inconsistent branding and poor user experience.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Understanding Color Spaces</h2>
          
          <p className="text-muted-foreground mb-6">
            Color spaces define the range of colors that can be represented in digital images. Different devices and applications use different color spaces, making color management essential for consistency.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Common Color Spaces</h3>
          
          <div className="space-y-4 mb-8">
            {[
              {
                name: "sRGB",
                description: "Standard RGB color space for web and most consumer displays",
                usage: "Web images, social media, general photography",
                gamut: "Small but widely supported"
              },
              {
                name: "Adobe RGB",
                description: "Wider color gamut than sRGB, popular in professional photography",
                usage: "Professional photography, high-end printing",
                gamut: "Medium, 35% larger than sRGB"
              },
              {
                name: "ProPhoto RGB",
                description: "Very wide color gamut for professional image editing",
                usage: "RAW processing, professional retouching",
                gamut: "Large, includes most printable colors"
              },
              {
                name: "Display P3",
                description: "Apple's wide-gamut color space for modern displays",
                usage: "Modern Apple devices, HDR content",
                gamut: "25% larger than sRGB"
              }
            ].map((space, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{space.name}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                    {space.gamut}
                  </span>
                </div>
                <p className="text-muted-foreground mb-2">{space.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Best for:</strong> {space.usage}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">ICC Color Profiles</h2>
          
          <p className="text-muted-foreground mb-4">
            ICC (International Color Consortium) profiles describe how colors should be interpreted and displayed on specific devices or in specific color spaces.
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">Types of ICC Profiles</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {[
              {
                type: "Input Profiles",
                description: "Describe how cameras and scanners capture color",
                examples: "Camera profiles, scanner profiles"
              },
              {
                type: "Display Profiles",
                description: "Define how monitors and screens display color",
                examples: "Monitor calibration profiles, mobile device profiles"
              },
              {
                type: "Output Profiles",
                description: "Specify how printers reproduce color on paper",
                examples: "Printer profiles, paper-specific profiles"
              },
              {
                type: "Working Space Profiles",
                description: "Define color spaces for image editing",
                examples: "sRGB, Adobe RGB, ProPhoto RGB"
              }
            ].map((profile, index) => (
              <div key={index} className="p-4 bg-surface/30 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{profile.type}</h4>
                <p className="text-muted-foreground text-sm mb-2">{profile.description}</p>
                <p className="text-xs text-muted-foreground/80"><strong>Examples:</strong> {profile.examples}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Color Management Workflow</h2>

          <h3 className="text-xl font-semibold text-foreground mb-4">1. Calibrate Your Display</h3>
          
          <p className="text-muted-foreground mb-4">
            Accurate color starts with a properly calibrated monitor:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Monitor className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use a hardware colorimeter for professional calibration</span>
            </li>
            <li className="flex items-start gap-3">
              <Monitor className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Set white point to D65 (6500K) for general use</span>
            </li>
            <li className="flex items-start gap-3">
              <Monitor className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Target gamma of 2.2 for most applications</span>
            </li>
            <li className="flex items-start gap-3">
              <Monitor className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Calibrate regularly (monthly for critical work)</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">2. Choose Working Color Space</h3>
          
          <p className="text-muted-foreground mb-4">
            Select an appropriate working color space based on your output requirements:
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              Color Space Selection Guide
            </h4>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2">
              <li>• <strong>Web/Digital only:</strong> sRGB for maximum compatibility</li>
              <li>• <strong>Professional photography:</strong> Adobe RGB for better print reproduction</li>
              <li>• <strong>High-end retouching:</strong> ProPhoto RGB for maximum editing flexibility</li>
              <li>• <strong>Modern displays:</strong> Display P3 for wide-gamut screens</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-4">3. Embed Color Profiles</h3>
          
          <p className="text-muted-foreground mb-6">
            Always embed ICC profiles in your images to ensure consistent color interpretation across different applications and devices.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Color Conversion and Rendering Intents</h2>
          
          <p className="text-muted-foreground mb-4">
            When converting between color spaces, rendering intents determine how out-of-gamut colors are handled:
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                intent: "Perceptual",
                description: "Compresses the entire color gamut to fit the destination space",
                bestFor: "Photographs with many out-of-gamut colors"
              },
              {
                intent: "Relative Colorimetric",
                description: "Maps white point and clips out-of-gamut colors to nearest reproducible color",
                bestFor: "Most images, preserves in-gamut colors exactly"
              },
              {
                intent: "Saturation",
                description: "Preserves color saturation at the expense of accuracy",
                bestFor: "Graphics and charts where vivid colors are important"
              },
              {
                intent: "Absolute Colorimetric",
                description: "Preserves white point and clips out-of-gamut colors",
                bestFor: "Proofing and color-critical applications"
              }
            ].map((intent, index) => (
              <div key={index} className="p-4 bg-surface/50 rounded-lg border border-border">
                <h4 className="font-semibold text-foreground mb-2">{intent.intent}</h4>
                <p className="text-muted-foreground mb-2">{intent.description}</p>
                <p className="text-sm text-muted-foreground/80"><strong>Best for:</strong> {intent.bestFor}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Web Color Management</h2>
          
          <h3 className="text-xl font-semibold text-foreground mb-4">Browser Support</h3>
          
          <p className="text-muted-foreground mb-4">
            Modern browsers support color management, but implementation varies:
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Safari: Full color management support including Display P3</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Chrome: Color management for tagged images</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Firefox: Basic color management support</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Edge: Similar to Chrome implementation</span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mb-4">CSS Color Management</h3>
          
          <p className="text-muted-foreground mb-4">
            CSS now supports wide-gamut colors and color space specifications:
          </p>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
            <code className="text-sm text-foreground">
              {`/* Display P3 color space */
color: color(display-p3 1 0.5 0);

/* Wide-gamut RGB */
color: rgb(255 128 0 / 100% display-p3);

/* Lab color space */
color: lab(50% 20 -30);`}
            </code>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Print Color Management</h2>
          
          <p className="text-muted-foreground mb-4">
            Print color management requires understanding the relationship between RGB (light-based) and CMYK (ink-based) color reproduction:
          </p>

          <h3 className="text-xl font-semibold text-foreground mb-4">RGB to CMYK Conversion</h3>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Use appropriate CMYK profiles for your printing process</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Consider paper type and printing conditions</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Perform soft proofing before final output</span>
            </li>
            <li className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-muted-foreground">Communicate with your print service provider</span>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mb-4">Common Color Management Issues</h2>
          
          <div className="space-y-4 mb-8">
            {[
              "Images appearing too dark or light on different devices",
              "Color shifts when converting between color spaces",
              "Inconsistent colors between screen and print",
              "Loss of color information in narrow gamut spaces",
              "Unexpected color changes in web browsers",
              "Metadata loss during image processing"
            ].map((issue, index) => (
              <div key={index} className="flex gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Settings className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                <span className="text-yellow-800 dark:text-yellow-200">{issue}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Best Practices</h2>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
              Color Management Checklist
            </h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2">
              <li>✓ Calibrate your display regularly</li>
              <li>✓ Choose appropriate working color space</li>
              <li>✓ Always embed ICC profiles in images</li>
              <li>✓ Use consistent color settings across applications</li>
              <li>✓ Test on multiple devices and browsers</li>
              <li>✓ Understand your output requirements</li>
              <li>✓ Maintain color-managed workflow throughout</li>
              <li>✓ Document your color management decisions</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-4">Conclusion</h2>
          
          <p className="text-muted-foreground mb-6">
            Effective color management ensures that your creative vision is accurately communicated across all devices and media. While it requires initial setup and understanding, the investment pays off in consistent, professional results.
          </p>

          <p className="text-muted-foreground">
            Start with basic calibration and profile embedding, then gradually implement more advanced techniques as your needs and understanding grow. Remember that color management is an ongoing process that requires regular attention and updates.
          </p>
        </article>
      </div>
    </div>
  );
}