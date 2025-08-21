import { Shield, Zap, Users, Globe, Lock, Cpu, Heart, Star } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About JaeyGuides",
  description: "Learn about JaeyGuides — privacy-first PDF and image tools that run in your browser.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 shadow-lg">
              <Heart className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground mb-6">
            About <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">JaeyGuides</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            We build privacy-first PDF and image tools that run entirely in your browser.
            No uploads, no tracking, just powerful, secure, and intuitive tools that respect your data.
          </p>
        </div>

        {/* Our Story Section */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 lg:p-12 mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-4xl font-bold text-center text-foreground mb-10">Our Story</h2>
          <div className="text-lg text-muted-foreground max-w-3xl mx-auto space-y-6 leading-relaxed">
            <p>JaeyGuides began with a simple realization: everyday file tasks were becoming unnecessarily complicated and invasive. Why should you have to upload your private documents to a random server just to merge two PDFs? Why should you have to worry about what happens to your images after you resize them online?</p>
            <p>Frustrated by the lack of trustworthy, free tools, our founder, Jaey, decided to build a better alternative. The goal was to create a suite of utilities that were powerful, easy to use, and, most importantly, completely private. This led to the core principle of JaeyGuides: all processing must happen on the user's device.</p>
            <p>After months of development, leveraging modern web technologies like WebAssembly, we launched the first version of our tools. The response was overwhelmingly positive, and we have been committed to improving and expanding our offerings ever since, always guided by our community's feedback and our unwavering commitment to privacy.</p>
          </div>
        </div>

        {/* Meet the Creator Section */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl border border-primary/20 p-8 lg:p-12 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet the Creator</h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/3 text-center">
              <Image
                src="/jaey-avatar.png"
                alt="Jaey, Creator of JaeyGuides"
                width={192}
                height={192}
                className="w-48 h-48 rounded-full mx-auto mb-4 border-4 border-primary/50 shadow-lg"
              />
              <h3 className="text-2xl font-bold text-foreground">Jaey</h3>
              <p className="text-muted-foreground">Founder &amp; Developer</p>
            </div>
            <div className="md:w-2/3 text-lg text-muted-foreground leading-relaxed space-y-4">
              <p>&ldquo;I&apos;m a passionate developer who believes in the power of the open web and the importance of digital privacy. I created JaeyGuides to give people tools they can trust. When I&apos;m not coding, you can find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee.&rdquo;</p>
              <p>&ldquo;Your feedback is what drives this project forward. If you have any ideas or suggestions, please don&apos;t hesitate to reach out!&rdquo;</p>
            </div>
          </div>
        </div>

        {/* Our Commitment to Privacy Section */}
        <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 lg:p-12 mb-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-4xl font-bold text-center text-foreground mb-10">Our Commitment to Privacy</h2>
          <div className="grid md:grid-cols-2 gap-8 text-lg">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background/50">
              <Lock className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-2">Zero Uploads</h3>
                <p className="text-muted-foreground">Your files are never sent to our servers. All operations happen locally in your browser, ensuring your data stays in your hands.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background/50">
              <Shield className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-2">No Data Collection</h3>
                <p className="text-muted-foreground">We do not track, log, or analyze any of your activity or the files you process. Your privacy is not a product.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background/50">
              <Cpu className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-2">In-Browser Processing</h3>
                <p className="text-muted-foreground">We use the power of your own device to perform all the complex processing, thanks to modern web technologies.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-xl bg-background/50">
              <Globe className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-2">Transparent & Open</h3>
                <p className="text-muted-foreground">Our tools are built on open standards. We believe in transparency and being upfront about how our technology works.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-surface/80 backdrop-blur-sm border border-border/50 rounded-3xl p-10 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-3xl font-bold text-foreground mb-4">We Value Your Feedback</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? Your input helps us make JaeyGuides better for everyone. We'd love to hear from you!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}