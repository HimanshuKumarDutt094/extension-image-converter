"use client";

import { memo, useCallback } from "react";
import type { FrameSize } from "../image-editor/types";

interface FrameSelectorProps {
  frameSizes: FrameSize[];
  selectedFrame: FrameSize | null;
  onFrameSelect: (frame: FrameSize | null) => void;
}

export const FrameSelector = memo(function FrameSelector({
  frameSizes,
  selectedFrame,
  onFrameSelect,
}: FrameSelectorProps) {
  const handleFrameClick = useCallback(
    (frame: FrameSize) => {
      if (selectedFrame?.id === frame.id) {
        onFrameSelect(null); // Deselect if already selected
      } else {
        onFrameSelect(frame);
      }
    },
    [selectedFrame, onFrameSelect]
  );

  const handleClearSelection = useCallback(() => {
    onFrameSelect(null);
  }, [onFrameSelect]);

  return (
    <div className="rounded-lg bg-white/5 p-4 lg:row-span-1">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-white">Frame Sizes</h3>
        {selectedFrame && (
          <button
            type="button"
            onClick={handleClearSelection}
            className="text-slate-400 text-xs transition-colors hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {frameSizes.map((frame) => (
          <button
            key={frame.id}
            type="button"
            onClick={() => handleFrameClick(frame)}
            className={`rounded-md border p-3 text-left transition-all ${
              selectedFrame?.id === frame.id
                ? "border-blue-500 bg-blue-500/20 text-white"
                : "border-slate-600 bg-white/5 text-slate-300 hover:border-slate-500 hover:bg-white/10"
            }`}
            title={frame.description}
          >
            <div className="font-medium text-sm">{frame.name}</div>
            <div className="mt-1 text-slate-400 text-xs">
              {frame.width} x {frame.height}
            </div>
          </button>
        ))}
      </div>

      {selectedFrame && (
        <div className="mt-3 rounded border border-blue-500/20 bg-blue-500/10 p-2">
          <div className="text-blue-200 text-xs">
            <strong>Selected:</strong> {selectedFrame.name}
          </div>
          <div className="mt-1 text-slate-400 text-xs">
            {selectedFrame.description}
          </div>
        </div>
      )}
    </div>
  );
});
