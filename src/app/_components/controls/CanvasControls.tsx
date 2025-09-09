"use client";

import { memo, useCallback } from "react";
import type { CanvasTransform } from "../image-editor/types";

interface CanvasControlsProps {
  transform: CanvasTransform;
  onTransformChange: (transform: Partial<CanvasTransform>) => void;
  onZoomToFit: () => void;
}

export const CanvasControls = memo(function CanvasControls({
  transform,
  onTransformChange,
  onZoomToFit,
}: CanvasControlsProps) {
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(5, transform.scale * 1.2);
    onTransformChange({ scale: newScale });
  }, [transform.scale, onTransformChange]);

  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(0.1, transform.scale * 0.8);
    onTransformChange({ scale: newScale });
  }, [transform.scale, onTransformChange]);

  const handleResetZoom = useCallback(() => {
    onTransformChange({ scale: 1 });
  }, [onTransformChange]);

  const handleZoomToFit = useCallback(() => {
    onZoomToFit();
  }, [onZoomToFit]);

  const zoomPercentage = Math.round(transform.scale * 100);

  return (
    <div className="rounded-lg bg-white/5 p-4 lg:row-span-1">
      <h3 className="mb-3 font-medium text-white">Canvas Controls</h3>

      <div className="space-y-4">
        {/* Zoom Controls */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-slate-300 text-sm">Zoom</span>
            <span className="text-slate-400 text-sm">{zoomPercentage}%</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={transform.scale <= 0.1}
              className="rounded border border-slate-600 bg-white/5 px-3 py-2 text-slate-300 text-sm transition-colors hover:border-slate-500 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              title="Zoom Out"
            >
              <svg
                className="mx-auto h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>

            <input
              type="number"
              min="10"
              max="500"
              value={Math.round(transform.scale * 100)}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value);
                if (!Number.isNaN(value) && value >= 10 && value <= 500) {
                  onTransformChange({ scale: value / 100 });
                }
              }}
              className="w-20 rounded border border-slate-600 bg-white/5 px-2 py-2 text-center text-sm text-white focus:border-blue-500 focus:outline-none"
              title="Zoom percentage (10-500%)"
            />

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={transform.scale >= 5}
              className="rounded border border-slate-600 bg-white/5 px-3 py-2 text-slate-300 text-sm transition-colors hover:border-slate-500 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              title="Zoom In"
            >
              <svg
                className="mx-auto h-4 w-4"
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
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleResetZoom}
            className="rounded border border-slate-600 bg-white/5 px-3 py-2 text-slate-300 text-sm transition-colors hover:border-slate-500 hover:bg-white/10"
            title="Reset Zoom to 100%"
          >
            Reset Zoom
          </button>

          <button
            type="button"
            onClick={handleZoomToFit}
            className="rounded border border-slate-600 bg-white/5 px-3 py-2 text-slate-300 text-sm transition-colors hover:border-slate-500 hover:bg-white/10"
            title="Zoom to Fit Image"
          >
            Fit to Screen
          </button>
        </div>

        {/* Instructions */}
        <div className="rounded bg-blue-500/10 p-3">
          <div className="text-blue-200 text-xs">
            <strong>Controls:</strong>
          </div>
          <ul className="mt-1 text-slate-400 text-xs">
            <li>• Drag to pan the image</li>
            <li>• Mouse wheel to zoom</li>
            <li>• Use buttons for precise control</li>
          </ul>
        </div>
      </div>
    </div>
  );
});
