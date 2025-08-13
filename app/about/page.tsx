import { Shield, Zap, Users, Globe, Lock, Cpu, Heart, Star } from "lucide-react";

export const metadata = {
  title: "About JaeyGuides",
  description: "Learn about JaeyGuides — privacy-first PDF and image tools that run in your browser.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">JaeyGuides</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Privacy-first PDF and image tools that run entirely in your browser. 
            No uploads, no tracking, just powerful tools that respect your data.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              To provide fast, secure, and accessible tools for everyday document and image processing tasks, 
              while maintaining the highest standards of privacy and user experience.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 w-fit mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Privacy First</h3>
            <p className="text-muted-foreground">
              All processing happens locally in your browser. Your files never leave your device, 
              ensuring complete privacy and security.
            </p>
          </div>

          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized for speed with modern web technologies. No waiting for uploads or downloads 
              from remote servers.
            </p>
          </div>

          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit mb-4">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Always Available</h3>
            <p className="text-muted-foreground">
              Works offline once loaded. No account required, no subscriptions, 
              just tools that work when you need them.
            </p>
          </div>

          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 w-fit mb-4">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">User Focused</h3>
            <p className="text-muted-foreground">
              Clean, intuitive interface designed for both beginners and power users. 
              Accessible on any device, anywhere.
            </p>
          </div>

          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 w-fit mb-4">
              <Cpu className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Modern Technology</h3>
            <p className="text-muted-foreground">
              Built with cutting-edge web technologies including WebAssembly, 
              Canvas APIs, and modern JavaScript frameworks.
            </p>
          </div>

          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 w-fit mb-4">
              <Lock className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Zero Data Collection</h3>
            <p className="text-muted-foreground">
              We don&apos;t collect, store, or analyze your files or personal data. 
              What you process stays with you.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-8 lg:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose JaeyGuides?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In a world where data privacy is increasingly important, we&apos;ve built tools that put you in control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 mt-1">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">No Hidden Costs</h3>
                  <p className="text-muted-foreground">
                    All tools are completely free to use. No premium features, no subscriptions, no limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-1">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Cross-Platform</h3>
                  <p className="text-muted-foreground">
                    Works seamlessly on desktop, tablet, and mobile devices across all modern browsers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 mt-1">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Regular Updates</h3>
                  <p className="text-muted-foreground">
                    Continuously improved with new features, performance enhancements, and bug fixes.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 mt-1">
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Open Source Spirit</h3>
                  <p className="text-muted-foreground">
                    Built with transparency in mind, using open web standards and best practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 mt-1">
                  <Star className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                  <p className="text-muted-foreground">
                    Features and improvements based on real user feedback and needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 mt-1">
                  <Star className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Reliable Performance</h3>
                  <p className="text-muted-foreground">
                    Optimized algorithms ensure fast processing even for large files and complex operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? We&apos;d love to hear from you. 
            Your input helps us make JaeyGuides better for everyone.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}