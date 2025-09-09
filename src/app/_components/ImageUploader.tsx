"use client";
import type React from "react";
import { useEffect, useState } from "react";

type ResultType =
  | {
      ok: true;
      results: Array<{
        originalName: string;
        sizes: Record<string, string>;
        timestamp: number;
      }>;
    }
  | { error: string }
  | null;

export default function ImageUploader() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const [previews, setPreviews] = useState<
    Array<{ name: string; url: string }>
  >([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    setFiles(newFiles);

    // build previews
    if (newFiles && newFiles.length > 0) {
      const list: { name: string; url: string }[] = [];
      for (let i = 0; i < newFiles.length; i++) {
        const f = newFiles[i];
        if (f) list.push({ name: f.name, url: URL.createObjectURL(f) });
      }
      setPreviews(list);
    } else {
      setPreviews([]);
    }
  };

  useEffect(() => {
    return () => {
      // revoke object urls on unmount
      for (const p of previews) URL.revokeObjectURL(p.url);
    };
  }, [previews]);

  const upload = async () => {
    if (!files || files.length === 0) return;
    setLoading(true);
    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f) form.append("file", f);
    }

    try {
      const res = await fetch("/api/convert", { method: "POST", body: form });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded bg-white/10 p-4">
      <h3 className="font-bold text-xl">Image Converter</h3>
      <p className="text-sm">
        Upload images and we'll resize them to the required extension tile sizes
        and return PNGs.
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="mt-2"
      />
      {previews.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {previews.map((p) => (
            <div key={p.url} className="flex w-24 flex-col items-center">
              <img
                src={p.url}
                alt={p.name}
                className="h-16 w-full rounded object-cover"
              />
              <div className="w-full truncate text-center text-xs">
                {p.name}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2"
          onClick={upload}
          disabled={loading || !files}
        >
          {loading ? "Processing..." : "Upload & Convert"}
        </button>
      </div>

      {result && "ok" in result && result.ok && (
        <div className="mt-4 grid gap-4">
          {result.results.map(
            (
              r: {
                originalName: string;
                sizes: Record<string, string>;
                timestamp: number;
              },
              idx: number
            ) => (
              <div
                key={`${r.originalName ?? "file"}-${idx}`}
                className="rounded bg-white/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{r.originalName}</div>
                    <div className="text-slate-400 text-xs">
                      Converted sizes
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {Object.entries(r.sizes).map(
                    ([sizeName, url]: [string, string]) => (
                      <div
                        key={sizeName}
                        className="flex w-36 flex-col items-center gap-2 sm:w-40 md:w-44 lg:w-48"
                      >
                        <img
                          src={url}
                          alt={`${r.originalName}-${sizeName}`}
                          className="h-24 w-full rounded object-cover sm:h-28"
                        />
                        <div
                          className="w-full truncate text-center text-slate-300 text-xs"
                          title={String(sizeName)}
                        >
                          {sizeName}
                        </div>
                        <a
                          href={url}
                          download
                          className="mt-1 rounded bg-green-600 px-3 py-1 text-xs"
                        >
                          Download
                        </a>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {result && "error" in result && (
        <div className="mt-4 rounded bg-red-500/10 p-2 text-red-200 text-sm">
          {String(result.error)}
        </div>
      )}
    </div>
  );
}
