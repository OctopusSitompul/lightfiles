"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import FileList, { FileItem } from "@/components/FileList";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);

  const simulateCompression = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, status: "compressing", progress: 0 } : f
      )
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Calculate random reduction 40-60%
        const reductionFactor = 0.4 + Math.random() * 0.2;

        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileId) {
              return {
                ...f,
                status: "completed",
                progress: 100,
                compressedSize: Math.floor(f.originalSize * (1 - reductionFactor)),
              };
            }
            return f;
          })
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress } : f
          )
        );
      }
    }, 500);
  }, []);

  const handleFilesSelected = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map((file) => ({
      id: uuidv4(),
      file,
      originalSize: file.size,
      status: "pending",
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFileItems]);

    // Start compression simulation for each new file
    newFileItems.forEach((item) => simulateCompression(item.id));
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDownload = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Compress your files <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              without losing quality
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Reduce file size up to 60% while maintaining the best quality.
            <br />
            <span className="text-indigo-600 font-semibold">Secure</span>, <span className="text-indigo-600 font-semibold">Fast</span>, and <span className="text-indigo-600 font-semibold">Free</span> for everyone.
          </p>
        </div>

        <UploadZone onFilesSelected={handleFilesSelected} />

        <FileList files={files} onRemove={handleRemoveFile} onDownload={handleDownload} />
      </div>
    </main>
  );
}
