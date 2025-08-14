import { FileText, Image, File, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  file: File;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FilePreview({ file, className, size = "md" }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  if (isImage) {
    return (
      <div className={cn("relative rounded-lg overflow-hidden bg-muted", sizeClasses[size], className)}>
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-full object-cover"
          onLoad={(e) => {
            // Clean up the object URL after loading
            setTimeout(() => URL.revokeObjectURL(e.currentTarget.src), 1000);
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center rounded-lg bg-muted", sizeClasses[size], className)}>
      {isPdf ? (
        <FileText className={cn("text-primary", iconSizeClasses[size])} />
      ) : (
        <File className={cn("text-muted", iconSizeClasses[size])} />
      )}
    </div>
  );
}

export function FilePreviewList({ files, className }: { files: File[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2", className)}>
      {files.map((file, index) => (
        <FilePreview key={`${file.name}-${index}`} file={file} size="sm" />
      ))}
    </div>
  );
}