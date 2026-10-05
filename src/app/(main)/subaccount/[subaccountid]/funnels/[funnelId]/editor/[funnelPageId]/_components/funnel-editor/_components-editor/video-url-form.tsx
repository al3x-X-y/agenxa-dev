"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { extractYouTubeId } from "../editor-utils";
import { CheckCircle2, Play, Video, AlertCircle } from "lucide-react";

type Props = {
    onSave: (url: string) => void;
    defaultUrl?: string;
};

const VideoUrlForm: React.FC<Props> = ({ onSave, defaultUrl = "" }) => {
    const { setClose } = useModal();
    const [url, setUrl] = useState(defaultUrl);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Auto-focus input when modal opens
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const youtubeId = extractYouTubeId(url);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) {
            setError("Please enter a video URL or YouTube link");
            return;
        }

        if (!youtubeId && !trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            setError("Please enter a valid YouTube link or video URL");
            return;
        }

        onSave(trimmed);
    };

    const handleUseSample = () => {
        setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        setError("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left pt-2">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-red-500" />
                        YouTube Video URL
                    </span>
                    <button
                        type="button"
                        onClick={handleUseSample}
                        className="text-xs text-primary hover:underline font-normal cursor-pointer"
                    >
                        Use sample video
                    </button>
                </label>
                <Input
                    ref={inputRef}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        if (error) setError("");
                    }}
                    className={error ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {error && (
                    <div className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                <p className="text-xs text-muted-foreground">
                    Paste any YouTube URL (standard watch link, share link, shorts, or embed code).
                </p>
            </div>

            {youtubeId && (
                <div className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/40 transition-all">
                    <div className="relative w-24 h-14 rounded overflow-hidden shrink-0 bg-black/20 flex items-center justify-center">
                        <Image
                            src={`https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`}
                            alt="YouTube Thumbnail"
                            width={96}
                            height={56}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Valid YouTube Video</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono truncate">
                            ID: {youtubeId}
                        </span>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={setClose}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex items-center gap-1.5"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Insert Video
                </Button>
            </div>
        </form>
    );
};

export default VideoUrlForm;
