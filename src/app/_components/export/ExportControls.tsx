"use client";

import { memo, useCallback, useState } from "react";
import type { ExportOptions, GradientOptions } from "../image-editor/types";
import { GradientSelector } from "./GradientSelector";

interface ExportControlsProps {
  onExport: (options: ExportOptions) => void;
  isLoading: boolean;
  hasImage: boolean;
}

export const ExportControls = memo(function ExportControls({
  onExport,
  isLoading,
  hasImage,
}: ExportControlsProps) {
  const [filename, setFilename] = useState("");
  const [backgroundGradient, setBackgroundGradient] = useState<GradientOptions>(
    {
      type: "linear",
      angle: 90,
      stops: [
        { color: "#ffffff", position: 0 },
        { color: "#000000", position: 100 },
      ],
    }
  );

  const handleExport = useCallback(() => {
    if (!hasImage || isLoading) return;

    const baseFilename = filename.trim() || "edited-image";
    const exportOptions: ExportOptions = {
      format: "png",
      quality: 100, // PNG is lossless
      filename: `${baseFilename}.png`,
      backgroundGradient, // Add background gradient to export options
    };

    onExport(exportOptions);
  }, [filename, backgroundGradient, hasImage, isLoading, onExport]);

  const handleFilenameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilename(e.target.value);
    },
    []
  );

  return (
    <div className="h-fit w-full rounded-lg bg-white/5 p-4 lg:col-span-3">
      <h3 className="mb-3 font-medium text-white">Export Image</h3>
      <div className="rounded bg-green-500/10 p-3">
        <div className="text-green-200 text-xs">
          <strong>Export Format:</strong> PNG (Frame Size)
        </div>
        <div className="mt-1 text-slate-400 text-xs">
          Images are exported at the selected frame dimensions with your chosen
          background gradient. PNG format ensures lossless quality for extension
          stores.
        </div>
      </div>
      <div className="flex items-start justify-between space-y-4">
        {/* Filename Input */}
        <div>
          <label
            htmlFor="export-filename"
            className="mb-2 block text-slate-300 text-sm"
          >
            Filename
          </label>
          <input
            id="export-filename"
            type="text"
            value={filename}
            onChange={handleFilenameChange}
            placeholder="edited-image"
            className="w-full rounded border border-slate-600 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
        </div>

        {/* Background Gradient */}
        <div className="flex-1">
          <GradientSelector
            value={backgroundGradient}
            onChange={setBackgroundGradient}
            disabled={isLoading}
          />
        </div>

        {/* Export Info */}

        {/* Export Button */}
        <div className="space-y-3 self-center">
          <button
            type="button"
            onClick={handleExport}
            disabled={!hasImage || isLoading}
            className="w-full rounded bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Exporting...
              </div>
            ) : (
              "Export PNG"
            )}
          </button>

          {/* Upload New Image Button */}
          {/* <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded bg-slate-600 px-4 py-3 font-medium text-white transition-colors hover:bg-slate-700"
            title="Upload a new image"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button> */}
        </div>

        {/* Instructions */}
        {!hasImage && (
          <div className="rounded bg-yellow-500/10 p-3">
            <div className="text-xs text-yellow-200">
              <strong>Note:</strong> Upload an image first to enable export.
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
