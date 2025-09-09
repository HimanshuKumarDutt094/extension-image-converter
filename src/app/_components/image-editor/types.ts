// Core types for the image editor

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Point, Size {}

export interface ImageData {
  file: File;
  url: string;
  originalSize: Size;
  name: string;
}

export interface FrameSize {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
}

export interface CanvasTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorState {
  image: ImageData | null;
  canvasSize: Size;
  transform: CanvasTransform;
  selectedFrame: FrameSize | null;
  cropArea: CropArea | null;
  isLoading: boolean;
  error: string | null;
}

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface GradientOptions {
  type: "linear" | "radial";
  angle: number; // for linear gradients
  stops: GradientStop[];
}

export interface ExportOptions {
  format: "png" | "jpeg" | "webp";
  quality: number;
  filename: string;
  backgroundColor?: string;
  backgroundGradient?: GradientOptions;
}

export type EditorAction =
  | { type: "SET_IMAGE"; payload: ImageData }
  | { type: "SET_CANVAS_SIZE"; payload: Size }
  | { type: "SET_TRANSFORM"; payload: Partial<CanvasTransform> }
  | { type: "SET_SELECTED_FRAME"; payload: FrameSize | null }
  | { type: "SET_CROP_AREA"; payload: CropArea | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" };

export interface CanvasRef {
  getImageData: () => ImageData | null;
  getCanvasBlob: (options: ExportOptions) => Promise<Blob | null>;
  zoomToFit: () => void;
  resetTransform: () => void;
}

export interface ImageEditorProps {
  className?: string;
  maxFileSize?: number;
  acceptedTypes?: string[];
  frameSizes?: FrameSize[];
}
