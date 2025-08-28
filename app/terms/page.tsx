import { Scale, FileText, Shield, AlertTriangle, Users, Gavel, CheckCircle, Info, Mail } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20">
              <Scale className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Terms of Service</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Clear, fair terms that protect both you and us while you use JaeyGuides.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-blue-700 dark:text-blue-400">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Effective: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-8 lg:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Terms Summary</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The key points you need to know about using JaeyGuides.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Free to Use</h3>
              <p className="text-muted-foreground">
                All tools are completely free with no hidden costs or premium features.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Responsibility</h3>
              <p className="text-muted-foreground">
                Ensure you have rights to process your files and use tools lawfully.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 w-fit mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Use at Own Risk</h3>
              <p className="text-muted-foreground">
                Tools provided &quot;as is&quot; - always backup important data before processing.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Terms */}
        <div className="space-y-8">
          {/* Acceptance */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By using JaeyGuides, you agree to these terms and all applicable laws.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>These terms apply to all users of JaeyGuides tools and services</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>By accessing or using our website, you automatically agree to these terms</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>If you don&apos;t agree with any part of these terms, please don&apos;t use our services</p>
              </div>
            </div>
          </div>

          {/* Local Processing */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">2. Local Processing & Privacy</h2>
                <p className="text-muted-foreground">
                  How our tools work and what this means for your data.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>All tools run entirely in your browser using modern web technologies</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Files are not uploaded to remote servers unless explicitly stated</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Your data remains on your device throughout the processing</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Generated files are created as temporary browser objects</p>
              </div>
            </div>
          </div>

          {/* User Responsibilities */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">3. User Responsibilities</h2>
                <p className="text-muted-foreground">
                  What we expect from you when using our tools.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>Ensure you have the legal right to process and modify the files you upload</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>Do not use our tools for illegal, harmful, or malicious purposes</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>Always backup important data before processing - we&apos;re not responsible for data loss</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>Respect copyright, intellectual property, and privacy rights of others</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>Don&apos;t attempt to reverse engineer, hack, or abuse our services</p>
              </div>
            </div>
          </div>

          {/* Service Availability */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Info className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">4. Service Availability & Warranties</h2>
                <p className="text-muted-foreground">
                  What you can expect from our service and what we can&apos;t guarantee.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p>Tools are provided &quot;as is&quot; without warranties of any kind</p>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p>We don&apos;t guarantee the service will be error-free or uninterrupted</p>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p>We may modify, suspend, or discontinue features at any time</p>
              </div>
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <p>Service availability may vary based on your browser and device capabilities</p>
              </div>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <Gavel className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">5. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  Important legal protections and limitations.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p>We&apos;re not liable for any data loss, corruption, or damage to your files</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p>We&apos;re not responsible for indirect, incidental, or consequential damages</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p>Our liability is limited to the maximum extent permitted by law</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p>You use our tools at your own risk and discretion</p>
              </div>
            </div>
          </div>

          {/* Changes to Terms */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">6. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  How we handle updates to these terms.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p>We may update these terms from time to time to reflect changes in our service</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p>Continued use of our service after changes constitutes acceptance</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p>We&apos;ll update the &quot;Effective&quot; date at the top when terms change</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <p>Major changes will be communicated through our website</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-8 text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Questions About These Terms?</h2>
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about these Terms of Service or need clarification on any point, 
              we&apos;re here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us About Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
