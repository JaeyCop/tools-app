import React from 'react';
import { X } from 'lucide-react';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  children: React.ReactNode;
  hasFiles?: boolean;
  onClearAll?: () => void;
  className?: string;
}

export default function ToolLayout({
  title,
  description,
  icon,
  gradientFrom,
  gradientTo,
  children,
  hasFiles = false,
  onClearAll,
  className = ""
}: ToolLayoutProps) {
  return (
    <div className={`tool-container ${className}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl md:py-12">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row md:mb-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl shadow-lg`}>
                {icon}
              </div>
              <h1 className={`tool-title bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
                {title}
              </h1>
            </div>
            <p className="tool-description">
              {description}
            </p>
          </div>
          
          {hasFiles && onClearAll && (
            <button
              onClick={onClearAll}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors touch-target"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 md:mt-16">
          <p className="text-sm">
            🔒 All processing happens locally in your browser - your files never leave your device
          </p>
        </div>
      </div>
    </div>
  );
}

// Subcomponents for common tool sections

interface ToolCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolCard({ children, className = "" }: ToolCardProps) {
  return (
    <div className={`tool-card ${className}`}>
      <div className="tool-card-content">
        {children}
      </div>
    </div>
  );
}

interface ToolSectionProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
  badge?: string;
  className?: string;
}

export function ToolSection({ 
  title, 
  icon, 
  iconBg, 
  children, 
  badge,
  className = "" 
}: ToolSectionProps) {
  return (
    <ToolCard className={className}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-1">
          {title}
        </h3>
        {badge && (
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
            {badge}
          </span>
        )}
      </div>
      {children}
    </ToolCard>
  );
}

interface FileUploadAreaProps {
  onDrop: (files: File[]) => void;
  accept: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: string;
  supportedFormats?: string;
  isDragActive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function FileUploadArea({
  onDrop,
  accept,
  multiple = false,
  maxSize = "50MB",
  supportedFormats,
  isDragActive = false,
  className = "",
  children
}: FileUploadAreaProps) {
  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  }, [onDrop]);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onDrop(files);
  }, [onDrop]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => e.preventDefault()}
      className={`
        file-upload-area mobile-upload
        ${isDragActive ? 'dragover' : ''}
        ${className}
      `}
    >
      <input
        type="file"
        multiple={multiple}
        accept={Object.values(accept).flat().join(',')}
        onChange={handleInputChange}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer block">
        {children || (
          <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
            <div className="mb-4 md:mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200">
                {isDragActive ? "Drop your files here!" : "Upload your files"}
              </p>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                {supportedFormats} • Max {maxSize}
              </p>
            </div>
          </div>
        )}
      </label>
    </div>
  );
}

interface ProcessingButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  processingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProcessingButton({
  onClick,
  disabled = false,
  isProcessing = false,
  processingText = "Processing...",
  children,
  variant = 'primary',
  size = 'md',
  className = ""
}: ProcessingButtonProps) {
  const baseClasses = "group relative font-semibold transition-all duration-300 transform touch-target";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl md:py-4 md:rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-xl md:rounded-2xl"
  };

  const variantClasses = {
    primary: disabled || isProcessing
      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary: disabled || isProcessing
      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {isProcessing ? (
        <span className="inline-flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {processingText}
        </span>
      ) : (
        children
      )}
      {!isProcessing && !disabled && variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </button>
  );
}

interface StatusCardProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'processing';
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function StatusCard({
  type,
  title,
  description,
  action,
  children,
  className = ""
}: StatusCardProps) {
  const typeClasses = {
    success: "status-success",
    error: "status-error", 
    warning: "status-warning",
    info: "status-info",
    processing: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
  };

  const iconClasses = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600", 
    info: "text-blue-600",
    processing: "text-blue-600"
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-5.898 8.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        );
    }
  };

  return (
    <div className={`${typeClasses[type]} rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${iconClasses[type]}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{title}</h3>
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
          {children}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

// Form components with mobile optimizations
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  description?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ 
  label, 
  children, 
  description, 
  required = false, 
  className = "" 
}: FormFieldProps) {
  return (
    <div className={className}>
      <label className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  columns = 3, 
  gap = 'md',
  className = "" 
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}