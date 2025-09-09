"use client";

import { useCallback, useMemo, useReducer, useRef } from "react";
import { Canvas } from "../canvas/Canvas";
import { CanvasControls } from "../controls/CanvasControls";
import { FrameSelector } from "../controls/FrameSelector";
import { ExportControls } from "../export/ExportControls";
import { ImageUploader } from "./ImageUploader";
import type {
  CanvasRef,
  EditorAction,
  EditorState,
  ExportOptions,
  FrameSize,
  ImageData,
} from "./types";

// Microsoft Edge Add-ons store specifications
const DEFAULT_FRAME_SIZES: FrameSize[] = [
  {
    id: "small-tile",
    name: "Small Promotional Tile",
    width: 440,
    height: 280,
    description: "440x280px - Microsoft Edge Add-ons small promotional tile",
  },
  {
    id: "large-tile",
    name: "Large Promotional Tile",
    width: 1400,
    height: 560,
    description: "1400x560px - Microsoft Edge Add-ons large promotional tile",
  },
  {
    id: "screenshot-1280",
    name: "Screenshot (1280x800)",
    width: 1280,
    height: 800,
    description: "1280x800px - Microsoft Edge Add-ons screenshot",
  },
  {
    id: "screenshot-640",
    name: "Screenshot (640x400)",
    width: 640,
    height: 400,
    description: "640x400px - Microsoft Edge Add-ons screenshot",
  },
];

const initialState: EditorState = {
  image: null,
  canvasSize: { width: 800, height: 600 },
  transform: { scale: 1, offsetX: 0, offsetY: 0 },
  selectedFrame: null,
  cropArea: null,
  isLoading: false,
  error: null,
};

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_IMAGE":
      return {
        ...state,
        image: action.payload,
        error: null,
        transform: { scale: 1, offsetX: 0, offsetY: 0 }, // Reset transform on new image
      };
    case "SET_CANVAS_SIZE":
      return { ...state, canvasSize: action.payload };
    case "SET_TRANSFORM":
      return {
        ...state,
        transform: { ...state.transform, ...action.payload },
      };
    case "SET_SELECTED_FRAME":
      return { ...state, selectedFrame: action.payload };
    case "SET_CROP_AREA":
      return { ...state, cropArea: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "RESET":
      return {
        ...initialState,
        canvasSize: state.canvasSize, // Keep canvas size
      };
    default:
      return state;
  }
}

interface ImageEditorProps {
  className?: string;
  maxFileSize?: number;
  acceptedTypes?: string[];
  frameSizes?: FrameSize[];
  onImageStateChange?: (hasImage: boolean) => void;
}

export default function ImageEditor({
  className = "",
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  frameSizes = DEFAULT_FRAME_SIZES,
  onImageStateChange,
}: ImageEditorProps) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const canvasRef = useRef<CanvasRef>(null);

  const handleImageUpload = useCallback(
    (imageData: ImageData) => {
      onImageStateChange?.(true);
      dispatch({ type: "SET_IMAGE", payload: imageData });
    },
    [onImageStateChange]
  );

  const handleFrameSelect = useCallback((frame: FrameSize | null) => {
    dispatch({ type: "SET_SELECTED_FRAME", payload: frame });
  }, []);

  const handleTransformChange = useCallback(
    (transform: Partial<typeof state.transform>) => {
      dispatch({ type: "SET_TRANSFORM", payload: transform });
    },
    []
  );

  const handleExport = useCallback(async (options: ExportOptions) => {
    if (!canvasRef.current) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const blob = await canvasRef.current.getCanvasBlob(options);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = options.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: `Export failed: ${String(error)}`,
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const memoizedFrameSizes = useMemo(() => frameSizes, [frameSizes]);

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Section - Always visible */}
      <div className="mb-6">
        <ImageUploader
          onImageUpload={handleImageUpload}
          maxFileSize={maxFileSize}
          acceptedTypes={acceptedTypes}
          isLoading={state.isLoading}
          hasImage={!!state.image}
        />
      </div>

      {/* Error Display */}
      {state.error && (
        <div className="mb-4 rounded bg-red-500/10 p-3 text-red-200">
          {state.error}
        </div>
      )}

      {/* Main Editor Interface */}
      {state.image && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-3">
          {/* Canvas Area */}
          <div className="rounded-lg bg-white/5 p-4 lg:col-span-2 lg:row-span-2">
            <Canvas
              ref={canvasRef}
              image={state.image}
              canvasSize={state.canvasSize}
              transform={state.transform}
              selectedFrame={state.selectedFrame}
              onTransformChange={handleTransformChange}
            />
          </div>

          {/* Controls Panel */}
          <div className="space-y-4 lg:col-span-1 lg:row-span-2">
            {/* Frame Selector */}
            <FrameSelector
              frameSizes={memoizedFrameSizes}
              selectedFrame={state.selectedFrame}
              onFrameSelect={handleFrameSelect}
            />

            {/* Canvas Controls */}
            <CanvasControls
              transform={state.transform}
              onTransformChange={handleTransformChange}
              onZoomToFit={() => canvasRef.current?.zoomToFit()}
            />

            {/* Export Controls */}
          </div>
          <ExportControls
            onExport={handleExport}
            isLoading={state.isLoading}
            hasImage={!!state.image}
          />
        </div>
      )}

      {/* Loading Overlay */}
      {state.isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-lg bg-white/10 p-6">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <p className="text-sm">Processing...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
