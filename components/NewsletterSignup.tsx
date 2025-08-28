"use client";

import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSignup({ 
  title = "Stay Updated", 
  description = "Get the latest tutorials, tips, and insights delivered to your inbox.",
  className = ""
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      // Create a form and submit it to Mailchimp
      const form = document.createElement('form');
      form.action = 'https://jaeyguides.us6.list-manage.com/subscribe/post?u=d281054f122ccfa54bfa98066&id=f4a8dda729&f_id=00d2d5e5f0';
      form.method = 'post';
      form.target = '_blank';
      
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.name = 'EMAIL';
      emailInput.value = email;
      
      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = 'b_d281054f122ccfa54bfa98066_f4a8dda729';
      honeypot.style.position = 'absolute';
      honeypot.style.left = '-5000px';
      honeypot.setAttribute('aria-hidden', 'true');
      
      form.appendChild(emailInput);
      form.appendChild(honeypot);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      setStatus('success');
      setMessage('Thank you for subscribing! Please check your email to confirm.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className={`text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl border border-primary/20 p-8 lg:p-12 ${className}`}>
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
      </div>
      
      <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{title}</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
        {description}
      </p>

      {status === 'success' ? (
        <div className="flex items-center justify-center gap-3 text-green-600 dark:text-green-400">
          <CheckCircle className="h-6 w-6" />
          <p className="font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          
          {status === 'error' && (
            <div className="flex items-center justify-center gap-2 mt-4 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}
        </form>
      )}
      
      <p className="text-xs text-muted-foreground/70 mt-6">
        Join our community of file processing enthusiasts. Unsubscribe anytime.
      </p>
    </div>
  );
}