import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import EditorProvider from "@/providers/editor/editor-provider";
import FunnelEditorNavigation from "./_components/funnel-editor-navigation";
import FunnelEditorSidebar from "./_components/funnel-editor-sidebar";
import FunnelEditor from "./_components/funnel-editor";

type Props = {
    params: Promise<{
        subaccountid: string;
        funnelId: string;
        funnelPageId: string;
    }>;
};

const Page = async ({ params }: Props) => {
    const { subaccountid, funnelId, funnelPageId } = await params;

    const funnelPageDetails = await db.funnelPage.findFirst({
        where: {
            id: funnelPageId,
        },
    });

    if (!funnelPageDetails) {
        return redirect(`/subaccount/${subaccountid}/funnels/${funnelId}`);
    }

    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
            <EditorProvider subaccountId={subaccountid} funnelId={funnelId} pageDetails={funnelPageDetails}>
                <div className="flex flex-col h-full">
                    <FunnelEditorNavigation subaccountId={subaccountid} funnelId={funnelId} funnelPageDetails={funnelPageDetails} />
                    <div className="flex-1 flex justify-center overflow-hidden">
                        <FunnelEditor funnelPageId={funnelPageId} />
                    </div>
                    <FunnelEditorSidebar subaccountId={subaccountid} />
                </div>
            </EditorProvider>
        </div>
    );
};

export default Page;