"use client";

import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type {
  CanvasRef,
  CanvasTransform,
  ExportOptions,
  FrameSize,
  ImageData,
  Size,
} from "../image-editor/types";

interface CanvasProps {
  image: ImageData;
  canvasSize: Size;
  transform: CanvasTransform;
  selectedFrame: FrameSize | null;
  onTransformChange: (transform: Partial<CanvasTransform>) => void;
}

export const Canvas = memo(
  forwardRef<CanvasRef, CanvasProps>(function Canvas(
    { image, canvasSize, transform, selectedFrame, onTransformChange },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [imageElement, setImageElement] = useState<HTMLImageElement | null>(
      null
    );

    // Load image when image prop changes
    useEffect(() => {
      const img = new Image();
      img.onload = () => {
        setImageElement(img);
      };
      img.src = image.url;

      return () => {
        setImageElement(null);
      };
    }, [image.url]);

    // Draw canvas content
    const draw = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !imageElement) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

      // Save context for transformations
      ctx.save();

      // Apply transformations
      ctx.translate(transform.offsetX, transform.offsetY);
      ctx.scale(transform.scale, transform.scale);

      // Calculate image position to center it
      const scaledWidth = image.originalSize.width;
      const scaledHeight = image.originalSize.height;
      const x = -scaledWidth / 2;
      const y = -scaledHeight / 2;

      // Draw image
      ctx.drawImage(imageElement, x, y, scaledWidth, scaledHeight);

      // Restore context
      ctx.restore();

      // Draw frame overlay if selected
      if (selectedFrame) {
        drawFrameOverlay(ctx, selectedFrame, canvasSize);
      }
    }, [
      imageElement,
      image.originalSize,
      canvasSize,
      transform,
      selectedFrame,
    ]);

    // Draw frame overlay
    const drawFrameOverlay = useCallback(
      (ctx: CanvasRenderingContext2D, frame: FrameSize, canvasSize: Size) => {
        let displayWidth = frame.width;
        let displayHeight = frame.height;

        // If frame is larger than canvas, scale it down to fit
        if (
          frame.width > canvasSize.width ||
          frame.height > canvasSize.height
        ) {
          const scaleX = canvasSize.width / frame.width;
          const scaleY = canvasSize.height / frame.height;
          const scale = Math.min(scaleX, scaleY) * 0.9; // 90% to add some padding

          displayWidth = frame.width * scale;
          displayHeight = frame.height * scale;
        }

        // Center the frame (or scaled frame) on canvas
        const frameX = (canvasSize.width - displayWidth) / 2;
        const frameY = (canvasSize.height - displayHeight) / 2;

        // Draw frame border
        ctx.strokeStyle = "#3b82f6"; // blue-500
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(frameX, frameY, displayWidth, displayHeight);

        // Draw semi-transparent overlay outside frame
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, canvasSize.width, frameY); // Top
        ctx.fillRect(
          0,
          frameY + displayHeight,
          canvasSize.width,
          canvasSize.height - (frameY + displayHeight)
        ); // Bottom
        ctx.fillRect(0, frameY, frameX, displayHeight); // Left
        ctx.fillRect(
          frameX + displayWidth,
          frameY,
          canvasSize.width - (frameX + displayWidth),
          displayHeight
        ); // Right

        // Reset line dash
        ctx.setLineDash([]);
      },
      []
    );

    // Redraw when dependencies change
    useEffect(() => {
      draw();
    }, [draw]);

    // Handle mouse events for panning
    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
      },
      []
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return;

        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;

        onTransformChange({
          offsetX: transform.offsetX + deltaX,
          offsetY: transform.offsetY + deltaY,
        });

        setLastMousePos({ x: e.clientX, y: e.clientY });
      },
      [isDragging, lastMousePos, transform, onTransformChange]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle wheel events for zooming
    const handleWheel = useCallback(
      (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(
          0.1,
          Math.min(5, transform.scale * zoomFactor)
        );

        onTransformChange({ scale: newScale });
      },
      [transform.scale, onTransformChange]
    );

    // Zoom to fit functionality
    const zoomToFit = useCallback(() => {
      if (!imageElement) return;

      const scaleX = canvasSize.width / image.originalSize.width;
      const scaleY = canvasSize.height / image.originalSize.height;
      const newScale = Math.min(scaleX, scaleY) * 0.8; // 80% to add some padding

      onTransformChange({
        scale: newScale,
        offsetX: canvasSize.width / 2,
        offsetY: canvasSize.height / 2,
      });
    }, [imageElement, image.originalSize, canvasSize, onTransformChange]);

    // Reset transform
    const resetTransform = useCallback(() => {
      onTransformChange({
        scale: 1,
        offsetX: canvasSize.width / 2,
        offsetY: canvasSize.height / 2,
      });
    }, [canvasSize, onTransformChange]);

    // Export functionality
    const getCanvasBlob = useCallback(
      async (options: ExportOptions): Promise<Blob | null> => {
        if (!imageElement) return null;

        // If we have a selected frame, export at frame size with background
        if (selectedFrame) {
          const exportCanvas = document.createElement("canvas");
          const exportCtx = exportCanvas.getContext("2d");

          if (!exportCtx) return null;

          // Set canvas size to frame dimensions
          exportCanvas.width = selectedFrame.width;
          exportCanvas.height = selectedFrame.height;

          // Fill with background gradient
          if (options.backgroundGradient) {
            const gradient = options.backgroundGradient;
            let bgGradient: CanvasGradient;

            if (gradient.type === "linear") {
              // Calculate gradient coordinates based on angle
              const angle = (gradient.angle * Math.PI) / 180; // Convert to radians
              const centerX = selectedFrame.width / 2;
              const centerY = selectedFrame.height / 2;
              const length =
                Math.sqrt(
                  selectedFrame.width ** 2 + selectedFrame.height ** 2
                ) / 2;

              const x1 = centerX - Math.cos(angle) * length;
              const y1 = centerY - Math.sin(angle) * length;
              const x2 = centerX + Math.cos(angle) * length;
              const y2 = centerY + Math.sin(angle) * length;

              bgGradient = exportCtx.createLinearGradient(x1, y1, x2, y2);
            } else {
              // Radial gradient
              const centerX = selectedFrame.width / 2;
              const centerY = selectedFrame.height / 2;
              const radius =
                Math.min(selectedFrame.width, selectedFrame.height) / 2;

              bgGradient = exportCtx.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                radius
              );
            }

            // Add color stops
            for (const stop of gradient.stops) {
              bgGradient.addColorStop(stop.position / 100, stop.color);
            }

            exportCtx.fillStyle = bgGradient;
          } else {
            // Fallback to white background
            exportCtx.fillStyle = "#ffffff";
          }

          exportCtx.fillRect(0, 0, selectedFrame.width, selectedFrame.height);

          // Calculate scaling to fit image within frame
          const scaleX = selectedFrame.width / image.originalSize.width;
          const scaleY = selectedFrame.height / image.originalSize.height;
          const scale = Math.min(scaleX, scaleY);

          // Calculate position to center the image
          const scaledWidth = image.originalSize.width * scale;
          const scaledHeight = image.originalSize.height * scale;
          const x = (selectedFrame.width - scaledWidth) / 2;
          const y = (selectedFrame.height - scaledHeight) / 2;

          // Draw the scaled image
          exportCtx.drawImage(imageElement, x, y, scaledWidth, scaledHeight);

          return new Promise((resolve) => {
            exportCanvas.toBlob(
              (blob) => resolve(blob),
              options.format,
              options.quality / 100
            );
          });
        }

        // Fallback: export current canvas view
        const canvas = canvasRef.current;
        if (!canvas) return null;

        return new Promise((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob),
            options.format,
            options.quality / 100
          );
        });
      },
      [imageElement, image, selectedFrame]
    );

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        getImageData: () => image,
        getCanvasBlob,
        zoomToFit,
        resetTransform,
      }),
      [image, getCanvasBlob, zoomToFit, resetTransform]
    );

    return (
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="cursor-move border border-slate-600"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />

        {/* Canvas Info */}
        <div className="mt-2 text-slate-400 text-xs">
          <p>Zoom: {(transform.scale * 100).toFixed(0)}%</p>
          <p>
            Position: {Math.round(transform.offsetX)},{" "}
            {Math.round(transform.offsetY)}
          </p>
          {selectedFrame && (
            <p>
              Frame: {selectedFrame.width} x {selectedFrame.height}
            </p>
          )}
        </div>
      </div>
    );
  })
);
