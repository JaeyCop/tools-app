import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileValidationProps {
  file: File;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

export default function FileValidation({ file, maxSize = 200, allowedTypes = [], className }: FileValidationProps) {
  const fileSizeMB = file.size / (1024 * 1024);
  const isValidSize = fileSizeMB <= maxSize;
  const isValidType = allowedTypes.length === 0 || allowedTypes.some(type => file.type.includes(type) || file.name.toLowerCase().endsWith(type));
  
  const getSizeColor = (size: number) => {
    if (size <= maxSize * 0.5) return "text-success";
    if (size <= maxSize * 0.8) return "text-warning";
    return "text-error";
  };

  const getSizeIcon = (size: number) => {
    if (size <= maxSize * 0.5) return <CheckCircle className="w-4 h-4" />;
    if (size <= maxSize * 0.8) return <Info className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* File Size Validation */}
      <div className={cn("flex items-center gap-2 text-sm", getSizeColor(fileSizeMB))}>
        {getSizeIcon(fileSizeMB)}
        <span>
          {fileSizeMB.toFixed(1)} MB
          {!isValidSize && ` (max ${maxSize} MB)`}
        </span>
      </div>

      {/* File Type Validation */}
      {allowedTypes.length > 0 && (
        <div className={cn("flex items-center gap-2 text-sm", isValidType ? "text-success" : "text-error")}>
          {isValidType ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>
            {isValidType ? "Valid file type" : `Invalid type. Allowed: ${allowedTypes.join(", ")}`}
          </span>
        </div>
      )}

      {/* Warnings */}
      {fileSizeMB > maxSize * 0.8 && fileSizeMB <= maxSize && (
        <div className="flex items-center gap-2 text-sm text-warning">
          <Info className="w-4 h-4" />
          <span>Large file - processing may take longer</span>
        </div>
      )}
    </div>
  );
}

export function FileSizeIndicator({ size, maxSize = 200 }: { size: number; maxSize?: number }) {
  const percentage = (size / (maxSize * 1024 * 1024)) * 100;
  const getColor = (pct: number) => {
    if (pct <= 50) return "bg-success";
    if (pct <= 80) return "bg-warning";
    return "bg-error";
  };

  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className={cn("h-2 rounded-full transition-all duration-300", getColor(percentage))}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}