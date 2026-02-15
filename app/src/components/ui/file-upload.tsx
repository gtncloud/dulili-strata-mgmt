"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatFileSize, getFileIcon } from "@/lib/storage";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
}

export function FileUpload({
  onUpload,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif",
  maxSize = 10,
  disabled = false,
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError(null);

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (selectedFile.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await onUpload(file);
      setFile(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      {!file && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 hover:border-slate-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Drop your file here, or{" "}
                <span className="text-indigo-600">browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Max file size: {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selected File */}
      {file && (
        <div className="border border-slate-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-3xl">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!uploading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading || disabled}
                className="bg-gradient-primary"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}
    </div>
  );
}
