"use client";

import { memo, useCallback, useState } from "react";
import type { ImageData } from "./types";

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
  maxFileSize: number;
  acceptedTypes: string[];
  isLoading: boolean;
  hasImage: boolean;
}

export const ImageUploader = memo(function ImageUploader({
  onImageUpload,
  maxFileSize,
  acceptedTypes,
  isLoading,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `Unsupported file type. Please use: ${acceptedTypes.join(", ")}`;
      }
      if (file.size > maxFileSize) {
        return `File too large. Maximum size: ${Math.round(
          maxFileSize / 1024 / 1024
        )}MB`;
      }
      return null;
    },
    [acceptedTypes, maxFileSize]
  );

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);

      try {
        const url = URL.createObjectURL(file);

        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          const imageData: ImageData = {
            file,
            url,
            originalSize: {
              width: img.naturalWidth,
              height: img.naturalHeight,
            },
            name: file.name,
          };
          onImageUpload(imageData);
        };
        img.onerror = () => {
          setError("Failed to load image");
          URL.revokeObjectURL(url);
        };
        img.src = url;
      } catch (err) {
        setError(`Failed to process file: ${String(err)}`);
      }
    },
    [validateFile, onImageUpload]
  );

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);

      const files = e.dataTransfer.files;
      handleFileSelect(files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    },
    [handleFileSelect]
  );

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 rounded-lg border border-slate-600 bg-white/5 p-4">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <div className="flex-1">
          <p className="font-medium text-sm text-white">
            {isLoading ? "Processing..." : "Upload an image"}
          </p>
          <p className="text-slate-400 text-xs">
            {acceptedTypes.join(", ").toUpperCase()} • Max{" "}
            {Math.round(maxFileSize / 1024 / 1024)}MB
          </p>
        </div>

        <div className="flex-shrink-0">
          <input
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleInputChange}
            disabled={isLoading}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`inline-flex cursor-pointer items-center rounded-md px-3 py-2 font-medium text-sm transition-colors ${
              isLoading
                ? "cursor-not-allowed bg-slate-700 text-slate-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Choose File
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-2 rounded bg-red-500/10 p-2 text-red-200 text-xs">
          {error}
        </div>
      )}
    </div>
  );
});
