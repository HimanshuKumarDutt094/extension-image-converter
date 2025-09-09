"use client";

import { memo, useCallback } from "react";

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton = memo(function ResetButton({
  onReset,
}: ResetButtonProps) {
  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the image? This will restore the original uploaded image and clear all transformations."
    );

    if (confirmed) {
      onReset();
    }
  }, [onReset]);

  return (
    <div className="rounded-lg bg-white/5 p-4">
      <h3 className="mb-3 font-medium text-white">Reset Image</h3>

      <div className="space-y-4">
        <div className="rounded bg-orange-500/10 p-3">
          <div className="text-orange-200 text-xs">
            <strong>Warning:</strong> This action cannot be undone.
          </div>
          <div className="mt-1 text-slate-400 text-xs">
            Resetting will restore the original uploaded image and remove all
            zoom, pan, and frame selections.
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded bg-orange-600 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-700"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reset to Original
          </div>
        </button>
      </div>
    </div>
  );
});
