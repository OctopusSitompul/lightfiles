"use client";

import { useState, useEffect } from "react";
import { FileText, File as FileIcon, Presentation, CheckCircle2, Download, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileItem {
    id: string;
    file: File;
    originalSize: number;
    compressedSize?: number;
    status: "pending" | "compressing" | "completed" | "error";
    progress: number;
}

interface FileListProps {
    files: FileItem[];
    onRemove: (id: string) => void;
    onDownload: (file: File) => void;
}

export default function FileList({ files, onRemove, onDownload }: FileListProps) {
    if (files.length === 0) return null;

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (filename: string) => {
        if (filename.endsWith(".pdf")) return <FileText className="h-6 w-6 text-red-500" />;
        if (filename.endsWith(".docx")) return <FileIcon className="h-6 w-6 text-blue-500" />;
        if (filename.endsWith(".pptx")) return <Presentation className="h-6 w-6 text-orange-500" />;
        return <FileIcon className="h-6 w-6 text-slate-500" />;
    };

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 space-y-4">
            {files.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 group"
                >
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                            {getFileIcon(item.file.name)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-slate-800 truncate pr-4 text-lg">
                                    {item.file.name}
                                </h4>
                                {item.status === "completed" ? (
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Saved {Math.round(((item.originalSize - (item.compressedSize || 0)) / item.originalSize) * 100)}%
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
                                <span>{formatSize(item.originalSize)}</span>
                                {item.status === "completed" && item.compressedSize && (
                                    <span className="font-bold text-indigo-600 flex items-center gap-1">
                                        <span className="text-slate-400 font-normal line-through">{formatSize(item.originalSize)}</span>
                                        <span>→</span>
                                        {formatSize(item.compressedSize)}
                                    </span>
                                )}
                            </div>

                            <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "absolute top-0 left-0 h-full transition-all duration-300 rounded-full shadow-sm",
                                        item.status === "completed"
                                            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                            : "bg-gradient-to-r from-indigo-500 to-violet-500"
                                    )}
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        </div>

                        {item.status === "completed" && (
                            <button
                                onClick={() => onDownload(item.file)}
                                className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 shrink-0 hover:scale-105 active:scale-95"
                            >
                                <Download className="h-5 w-5" />
                            </button>
                        )}

                        {item.status === "compressing" && (
                            <div className="h-12 w-12 flex items-center justify-center shrink-0">
                                <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
