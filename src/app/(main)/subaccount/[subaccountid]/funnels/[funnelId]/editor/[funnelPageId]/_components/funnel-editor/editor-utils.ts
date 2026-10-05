import React from "react";

export function normalizeStyles(styles: React.CSSProperties = {}): React.CSSProperties {
    if (!styles) return {};
    const normalized: Record<string, any> = { ...styles };

    if ("font-weight" in normalized) {
        normalized.fontWeight = normalized["font-weight"];
        delete normalized["font-weight"];
    }

    if ("font-family" in normalized) {
        normalized.fontFamily = normalized["font-family"];
        delete normalized["font-family"];
    }

    const dimensionalKeys = [
        "height",
        "width",
        "minHeight",
        "maxHeight",
        "minWidth",
        "maxWidth",
        "fontSize",
        "marginTop",
        "marginBottom",
        "marginLeft",
        "marginRight",
        "paddingTop",
        "paddingBottom",
        "paddingLeft",
        "paddingRight",
        "borderRadius",
        "gap",
        "top",
        "bottom",
        "left",
        "right",
    ];

    dimensionalKeys.forEach((key) => {
        const val = normalized[key];
        if (typeof val === "string" && /^-?\d+(\.\d+)?$/.test(val.trim())) {
            normalized[key] = `${val.trim()}px`;
        }
    });

    return normalized as React.CSSProperties;
}

export function extractYouTubeId(url: string | undefined): string | null {
    if (!url) return null;
    const cleanUrl = url.trim();

    // 1. Matches ?v=VIDEO_ID or &v=VIDEO_ID (standard YouTube watch URLs with any query params)
    const vParamMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (vParamMatch && vParamMatch[1]) {
        return vParamMatch[1];
    }

    // 2. Matches youtu.be/VIDEO_ID
    const shortUrlMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortUrlMatch && shortUrlMatch[1]) {
        return shortUrlMatch[1];
    }

    // 3. Matches /embed/VIDEO_ID or /shorts/VIDEO_ID or /live/VIDEO_ID or /v/VIDEO_ID
    const pathMatch = cleanUrl.match(/\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
    if (pathMatch && pathMatch[1]) {
        return pathMatch[1];
    }

    // 4. Matches direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
        return cleanUrl;
    }

    return null;
}

export function formatVideoSrc(src: string | undefined): string {
    if (!src) return "";
    const cleanUrl = src.trim();
    const ytId = extractYouTubeId(cleanUrl);
    if (ytId) {
        return `https://www.youtube.com/embed/${ytId}`;
    }
    return cleanUrl;
}

