"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns } from "@/lib/constants";
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { normalizeStyles } from "../editor-utils";

type Props = {
    element: EditorElement;
};

const LinkComponent = ({ element }: Props) => {
    const spanRef = useRef<HTMLSpanElement | null>(null);
    const { dispatch, state } = useEditor();
    const { id, styles, content } = element;

    const handleSelectElement = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleBlurElement = () => {
        if (spanRef.current) {
            dispatch({
                type: "UPDATE_ELEMENT",
                payload: {
                    elementDetails: {
                        ...element,
                        content: {
                            ...(!Array.isArray(element.content) && element.content),
                            innerText: spanRef.current.innerText,
                        },
                    },
                },
            });
        }
    };

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    useEffect(() => {
        if (spanRef.current && !Array.isArray(content)) {
            spanRef.current.innerText = (content.innerText as string) || "";
        }
    }, [content]);

    const elementStyles = normalizeStyles(styles);

    return (
        <div
            style={{
                color: "black",
                ...elementStyles,
            }}
            className={clsx("p-[2px] w-full m-[5px] relative text-[16px] transition-all cursor-pointer", {
                "!border-blue-500": state.editor.selectedElement.id === id,
                "!border-solid": state.editor.selectedElement.id === id,
                "!border-dashed border border-slate-300": !state.editor.liveMode,
            })}
            onClick={handleSelectElement}
            onMouseDown={handleSelectElement}
        >
            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
                    {state.editor.selectedElement.name}
                </Badge>
            )}

            {!Array.isArray(content) && (state.editor.previewMode || state.editor.liveMode) && (
                <Link href={content.href || "#"}>{content.innerText || "Link"}</Link>
            )}

            {!state.editor.previewMode && !state.editor.liveMode && (
                <span
                    ref={spanRef}
                    suppressHydrationWarning={true}
                    contentEditable={!state.editor.liveMode}
                    onBlur={handleBlurElement}
                    onClick={handleSelectElement}
                    onMouseDown={handleSelectElement}
                />
            )}

            {state.editor.selectedElement.id === id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash className="cursor-pointer" size={16} onClick={handleDeleteElement} />
                </div>
            )}
        </div>
    );
};

export default LinkComponent;