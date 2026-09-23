"use client";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEditor } from "@/providers/editor/editor-provider";
import clsx from "clsx";
import React from "react";
import SettingsTab from "./tabs/settings-tab";
import ComponentsTab from "./tabs/components-tab";
import TabList from "./tabs";
import MediaBucketTab from "./tabs/media-bucket-tab";

type Props = {
    subaccountId: string;
};

const FunnelEditorSidebar = ({ subaccountId }: Props) => {
    const { state, dispatch } = useEditor();

    return (
        <Sheet open={true} modal={false}>
            <Tabs className="w-full" defaultValue="Settings">
                <SheetContent
                    showOverlay={false}
                    showCloseButton={false}
                    showX={false}
                    side={"right"}
                    className={clsx(
                        "!top-[72px] !h-[calc(100vh-72px)] !w-16 !max-w-[64px] !right-0 !bottom-0 !mt-0 z-[80] shadow-none p-0 focus:border-none transition-all overflow-hidden border-l bg-background",
                        {
                            hidden: state.editor.previewMode,
                        }
                    )}
                >
                    <TabList />
                </SheetContent>
                <SheetContent
                    showOverlay={false}
                    showCloseButton={false}
                    showX={false}
                    side={"right"}
                    className={clsx(
                        "!top-[72px] !h-[calc(100vh-72px)] !w-80 !max-w-[320px] !right-16 !mr-0 !bottom-0 !mt-0 z-[40] shadow-none p-0 focus:border-none transition-all overflow-hidden border-l bg-background",
                        {
                            hidden: state.editor.previewMode,
                        }
                    )}
                >
                    <div className="grid gap-4 h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-10">
                        <TabsContent value="Settings">
                            <SheetHeader className="text-left p-6">
                                <SheetTitle>Styles</SheetTitle>
                                <SheetDescription>Show your creativity! You can customize every component as you like.</SheetDescription>
                            </SheetHeader>
                            <SettingsTab />
                        </TabsContent>
                        <TabsContent value="Media">
                            <MediaBucketTab subaccountId={subaccountId} />
                        </TabsContent>
                        <TabsContent value="Components">
                            <SheetHeader className="text-left p-6 ">
                                <SheetTitle>Components</SheetTitle>
                                <SheetDescription>You can drag and drop components on the canvas</SheetDescription>
                            </SheetHeader>
                            <ComponentsTab />
                        </TabsContent>
                    </div>
                </SheetContent>
            </Tabs>
        </Sheet>
    );
};

export default FunnelEditorSidebar;