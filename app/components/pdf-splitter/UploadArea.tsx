"use client";

import { Upload, FileText, CheckCircle } from "lucide-react";
import { DropzoneState } from "react-dropzone";

interface UploadAreaProps {
  getRootProps: DropzoneState["getRootProps"];
  getInputProps: DropzoneState["getInputProps"];
  isDragActive: boolean;
}

export function UploadArea({ getRootProps, getInputProps, isDragActive }: UploadAreaProps) {
  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-8 lg:p-12 text-center cursor-pointer transition-all duration-300 group ${
        isDragActive
          ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20"
          : "border-border hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      <input {...getInputProps()} />

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-50 animate-pulse" />
      <div
        className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className={`relative transition-all duration-300 ${isDragActive ? "scale-110" : ""}`}>
        <div className="mb-6">
          {isDragActive ? (
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-lg">
              <Upload className="w-10 h-10 text-primary" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mx-auto group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
              <FileText className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">
            {isDragActive ? "Drop your PDF here!" : "Upload PDF File"}
          </h3>
          <p className="text-muted-foreground">Drag & drop a PDF file or click to browse</p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Single file</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Max 100MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}