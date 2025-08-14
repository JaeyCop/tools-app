import React from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ 
  title, 
  description, 
  icon, 
  children, 
  sidebar 
}) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center animate-slide-up">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20">
              {icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className={`${sidebar ? 'lg:grid lg:grid-cols-12 lg:gap-8' : ''} space-y-8 lg:space-y-0`}>
          {sidebar && (
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-8 space-y-6">
                <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  {sidebar}
                </div>
              </div>
            </aside>
          )}
          
          <main className={sidebar ? 'lg:col-span-8 xl:col-span-9' : ''}>
            <div className="bg-surface/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};