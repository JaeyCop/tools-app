import { Shield, Eye, Lock, Server, Database, UserCheck, FileX, Globe, AlertTriangle, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">Privacy Policy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your privacy is our priority. Learn how we protect your data and respect your digital rights.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-700 dark:text-green-400">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Key Principles */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-8 lg:p-12 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Privacy Principles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;ve built JaeyGuides with privacy by design. Here&apos;s what that means for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 w-fit mx-auto mb-4">
                <FileX className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No File Storage</h3>
              <p className="text-muted-foreground">
                Your files never leave your device. All processing happens locally in your browser.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-fit mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No Tracking</h3>
              <p className="text-muted-foreground">
                We don&apos;t track your activity, content, or personal information across the web.
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 w-fit mx-auto mb-4">
                <Database className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No Data Sales</h3>
              <p className="text-muted-foreground">
                We never sell, rent, or share your data with third parties for profit.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Local Processing */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Local-First Processing</h2>
                <p className="text-muted-foreground">
                  All file processing happens directly in your browser using modern web technologies.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Files are processed using WebAssembly, Canvas APIs, and JavaScript</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>No uploads to remote servers - everything stays on your device</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Works offline once the page is loaded</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Generated files are created as temporary browser objects</p>
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <Database className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">What We Don&apos;t Collect</h2>
                <p className="text-muted-foreground">
                  We&apos;ve designed our service to minimize data collection.
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Your files or file contents</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Personal information or identifiers</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Browsing history or behavior</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Location data or device information</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Cookies for tracking purposes</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">Email addresses or contact details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics & Advertising */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Privacy-Preserving Analytics & Ads</h2>
                <p className="text-muted-foreground">We use minimal analytics and display ads to keep the service free.</p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Basic usage statistics (page views, tool usage) without personal identifiers</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Error reporting to help us fix bugs and improve performance</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Advertising provided by Google AdSense. See <a className="underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">how Google uses information</a>.</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>Ads may use cookies or local storage for frequency capping, fraud prevention, and ad measurement.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Aggregated data that cannot be traced back to individual users</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <p>No file contents, names, or processing details are ever included</p>
              </div>
            </div>
          </div>

          {/* User Control */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Your Control & Rights</h2>
                <p className="text-muted-foreground">
                  You have complete control over your data and privacy settings.
                </p>
              </div>
            </div>
            
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Clear generated downloads by refreshing your browser tab</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Use your browser&apos;s privacy controls and clear data tools</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Block analytics using ad blockers or privacy extensions</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p>No account deletion needed - we don&apos;t store personal data</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-8 text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about our privacy practices or need clarification on how we handle data, 
              we&apos;re here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us About Privacy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
