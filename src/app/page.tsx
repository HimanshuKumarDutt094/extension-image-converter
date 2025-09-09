"use client";

import ImageEditor from "@/app/_components/image-editor/ImageEditor";
import { useState } from "react";

export default function Home() {
  const [hasImage, setHasImage] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl p-6">
        {/* Hero Section - Only show when no image is selected */}
        {!hasImage && (
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text font-extrabold text-4xl text-transparent">
              Extension Image Converter
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              Professional tool for creating perfect Chrome and Microsoft Edge
              extension store images. Convert and resize images to exact
              promotional tiles and screenshots specifications with instant PNG
              export.
            </p>
          </div>
        )}

        {/* Editor Component */}
        <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
          <ImageEditor onImageStateChange={setHasImage} />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-slate-400 text-sm">
          <p>
            All image processing happens locally in your browser. No files are
            uploaded to our servers.
          </p>
        </footer>
      </div>
    </main>
  );
}
