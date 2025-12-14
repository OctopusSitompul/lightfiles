"use client";

import { useState, useCallback, useRef } from "react";
import { UploadCloud, FileType, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
    onFilesSelected: (files: File[]) => void;
}

export default function UploadZone({ onFilesSelected }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFiles = (fileList: FileList | File[]) => {
        const validFiles: File[] = [];
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];

        setError(null);

        Array.from(fileList).forEach((file) => {
            if (allowedTypes.includes(file.type)) {
                validFiles.push(file);
            } else {
                setError("Some files were rejected. Only PDF, DOCX, and PPTX are allowed.");
            }
        });

        if (validFiles.length > 0) {
            onFilesSelected(validFiles);
        }
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            validateFiles(e.dataTransfer.files);
        },
        [onFilesSelected]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            validateFiles(e.target.files);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-300 ease-out",
                    isDragging
                        ? "border-indigo-500 bg-indigo-50/80 scale-[1.02] shadow-2xl shadow-indigo-100"
                        : "border-slate-200/80 bg-white/50 hover:border-indigo-400 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1",
                    "h-80 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept=".pdf,.docx,.pptx"
                />

                <div className="relative z-10 flex flex-col items-center gap-5">
                    <div
                        className={cn(
                            "p-5 rounded-2xl transition-all duration-300 shadow-sm",
                            isDragging
                                ? "bg-indigo-100 text-indigo-600 scale-110"
                                : "bg-white text-indigo-500 shadow-md group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:shadow-indigo-200"
                        )}
                    >
                        <UploadCloud className="h-12 w-12" />
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-900 transition-colors">
                            {isDragging ? "Drop files here" : "Drag & Drop files here"}
                        </h3>
                        <p className="text-base text-slate-500 max-w-xs mx-auto group-hover:text-slate-600 transition-colors">
                            or click to browse from your computer
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-50/80 px-4 py-1.5 rounded-full border border-indigo-100/50">
                        <FileType className="h-3.5 w-3.5" />
                        <span>PDF, DOCX, PPTX</span>
                    </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 -z-0" />
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}
        </div>
    );
}
