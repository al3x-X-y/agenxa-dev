import BlurPage from "@/components/global/blur-page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFunnel } from "@/lib/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import FunnelSettings from "./_components/funnel-settings";
import FunnelSteps from "./_components/funnel-steps";

type Props = {
    params: Promise<{
        funnelId: string;
        subaccountid: string;
    }>;
};

const Page = async ({ params }: Props) => {
    const { funnelId, subaccountid } = await params;
    const funnelPages = await getFunnel(funnelId);
    if (!funnelPages) return redirect(`/subaccount/${subaccountid}/funnels`);

    return (
        <BlurPage>
            <Link href={`/subaccount/${subaccountid}/funnels`} className="flex justify-between gap-4 mb-4 text-muted-foreground">
                Back
            </Link>
            <h1 className="text-3xl mb-8 flex-1">{funnelPages.name}</h1>
            <Tabs defaultValue="steps" className="w-full">
                <TabsList className="grid gap-4 grid-cols-2 bg-transparent ">
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="steps">
                    <FunnelSteps funnel={funnelPages} subaccountId={subaccountid} pages={funnelPages.FunnelPages} funnelId={funnelId} />
                </TabsContent>
                <TabsContent value="settings">
                    <FunnelSettings subaccountId={subaccountid} defaultData={funnelPages} />
                </TabsContent>
            </Tabs>
        </BlurPage>
    );
};

export default Page;