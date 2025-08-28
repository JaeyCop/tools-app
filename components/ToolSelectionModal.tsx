'use client';

import { motion, AnimatePresence } from 'framer-motion';

const tools = {
  image: [
    { id: 'compress-image', name: 'Compress Image', description: 'Reduce file size of JPG, PNG, WEBP.' },
    { id: 'resize-image', name: 'Resize Image', description: 'Change the dimensions of an image.' },
    { id: 'convert-image', name: 'Convert Image', description: 'Change format to JPG, PNG, WEBP.' },
    { id: 'image-to-pdf', name: 'Image to PDF', description: 'Convert images to a single PDF document.' },
  ],
  pdf: [
    { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size of PDF documents.' },
    { id: 'merge-pdf', name: 'Merge PDFs', description: 'Combine multiple PDFs into one.' },
    { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages from a PDF.' },
    { id: 'pdf-to-images', name: 'PDF to Images', description: 'Convert PDF pages to images (PNG/JPG).' },
  ],
};

interface ToolSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

export function ToolSelectionModal({ isOpen, onClose, onSelectTool }: ToolSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-background/60 z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="w-full max-w-3xl bg-surface/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
          >
            <div className="p-6 border-b border-border/50 bg-surface/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-foreground mb-2">Add a New Step</h2>
              <p className="text-muted-foreground">Choose a tool to add to your workflow and enhance your file processing pipeline.</p>
            </div>
            <div className="p-6 space-y-8 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
                      <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Image Tools</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tools.image.map((tool, index) => (
                          <button 
                            key={tool.id} 
                            onClick={() => onSelectTool(tool.id)} 
                            className="group p-5 text-left bg-surface/80 backdrop-blur-sm border border-border hover:border-primary/30 rounded-xl transition-all duration-300 hover-lift animate-scale-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative">
                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">{tool.name}</p>
                                <p className="text-sm text-muted-foreground group-hover:text-muted transition-colors duration-300">{tool.description}</p>
                              </div>
                          </button>
                      ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/10 to-accent/10 border border-secondary/10">
                      <svg className="h-5 w-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">PDF Tools</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tools.pdf.map((tool, index) => (
                          <button 
                            key={tool.id} 
                            onClick={() => onSelectTool(tool.id)} 
                            className="group p-5 text-left bg-surface/80 backdrop-blur-sm border border-border hover:border-secondary/30 rounded-xl transition-all duration-300 hover-lift animate-scale-in"
                            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                          >
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative">
                                <p className="font-semibold text-foreground group-hover:text-secondary transition-colors duration-300 mb-2">{tool.name}</p>
                                <p className="text-sm text-muted-foreground group-hover:text-muted transition-colors duration-300">{tool.description}</p>
                              </div>
                          </button>
                      ))}
                  </div>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
