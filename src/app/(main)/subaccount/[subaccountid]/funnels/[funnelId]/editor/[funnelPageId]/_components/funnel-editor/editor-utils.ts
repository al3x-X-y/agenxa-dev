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

export function formatVideoSrc(src: string | undefined): string {
    if (!src) return "";
    if (src.includes("watch?v=")) {
        return src.replace("watch?v=", "embed/");
    }
    if (src.includes("youtu.be/")) {
        const videoId = src.split("youtu.be/")[1]?.split("?")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : src;
    }
    return src;
}
