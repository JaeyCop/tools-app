import { Mail, MessageSquare, Clock, MapPin, Phone, Send, Heart, Star, CheckCircle, Users, Lightbulb, Bug } from "lucide-react";

export const metadata = {
  title: "Contact JaeyGuides",
  description: "Get in touch with JaeyGuides for support, feedback, or partnership inquiries. We&apos;d love to hear from you.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20">
              <MessageSquare className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Get in Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We&apos;d love to hear from you! Whether you have questions, feedback, or partnership ideas, 
            we&apos;re here to help and always excited to connect with our community.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Email Support */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Email Support</h3>
            <p className="text-muted-foreground mb-4">
              For general inquiries, support, or feedback about our tools.
            </p>
            <a 
              href="mailto:jaeyguides@gmail.com"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              jaeyguides@gmail.com
            </a>
          </div>

          {/* Bug Reports */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 w-fit mb-4">
              <Bug className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Bug Reports</h3>
            <p className="text-muted-foreground mb-4">
              Found a bug or issue? Help us improve by reporting it.
            </p>
            <a 
              href="mailto:jaeyguides@gmail.com?subject=Bug Report"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Bug className="h-4 w-4" />
              Report Bug
            </a>
          </div>

          {/* Feature Requests */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 w-fit mb-4">
              <Lightbulb className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Feature Ideas</h3>
            <p className="text-muted-foreground mb-4">
              Have an idea for a new tool or feature? We&apos;d love to hear it!
            </p>
            <a 
              href="mailto:jaeyguides@gmail.com?subject=Feature Request"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              Suggest Feature
            </a>
          </div>
        </div>

        {/* Main Contact Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Send us a Message</h2>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">For the quickest response, please email us directly. We aim to reply within 24-48 hours.</p>
              <a 
                href="mailto:jaeyguides@gmail.com?subject=Inquiry from JaeyGuides Website"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
                Send Us an Email
              </a>
            </div>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Response Time */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Response Time</h3>
              </div>
              <p className="text-muted-foreground">
                We typically respond to all inquiries within <strong>1-2 business days</strong>. 
                For urgent issues, please mention &quot;URGENT&quot; in your subject line.
              </p>
            </div>

            {/* What to Include */}
            <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Help us Help You</h3>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Describe your issue or question clearly</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Include your browser and device information for bugs</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Attach screenshots if relevant</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p>Let us know which tool you were using</p>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Join Our Community</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Connect with other users, share tips, and stay updated on new features.
              </p>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Discord Community (Coming Soon)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl border border-primary/20 p-8 lg:p-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions. Can&apos;t find what you&apos;re looking for? Contact us!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Are your tools really free?
                </h3>
                <p className="text-muted-foreground">
                  Yes! All our tools are completely free to use with no hidden costs, subscriptions, or premium features.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Do you store my files?
                </h3>
                <p className="text-muted-foreground">
                  No, all processing happens locally in your browser. Your files never leave your device.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Can I use these tools offline?
                </h3>
                <p className="text-muted-foreground">
                  Yes! Once the page loads, most tools work offline since everything runs in your browser.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  What file size limits do you have?
                </h3>
                <p className="text-muted-foreground">
                  Most tools support files up to 100MB. Larger files may work but could be slower to process.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Do you plan to add more tools?
                </h3>
                <p className="text-muted-foreground">
                  Absolutely! We&apos;re constantly working on new tools based on user feedback and requests.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Can I suggest new features?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We love hearing feature ideas from our users. Use the contact form above to share your suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="text-center bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 animate-slide-up" style={{ animationDelay: '0.9s' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your feedback and support help us make JaeyGuides better every day. 
            We&apos;re grateful for our amazing community of users who trust us with their daily tasks.
          </p>
        </div>
      </div>
    </div>
  );
}