import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/db";
import { getLanesWithTicketAndTags, getPipelineDetails, updateLanesOrder, updateTicketsOrder } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";
import PipelineInfoBar from "../_components/pipeline-infobar";
import PipelineSettings from "../_components/pipeline-settings";
import PipelineView from "../_components/pipeline-view";

type Props = {
    params: Promise<{ subaccountid: string; pipelineid: string }>;
};

const Page = async ({ params }: Props) => {
    const { subaccountid, pipelineid } = await params;
    const pipelineDetails = await getPipelineDetails(pipelineid);

    if (!pipelineDetails) {
        return redirect(`/subaccount/${subaccountid}/pipelines`);
    }

    const pipelines = await db.pipeline.findMany({
        where: {
            subAccountId: subaccountid,
        },
    });

    const rawLanes = await getLanesWithTicketAndTags(pipelineid);
    const lanes = rawLanes.map((lane) => ({
        ...lane,
        Tickets: lane.Tickets.map((ticket) => ({
            ...ticket,
            value: ticket.value ? Number(ticket.value) : null,
        })),
    })) as unknown as LaneDetail[];

    return (
        <Tabs defaultValue="view" className="w-full flex flex-col">
            <TabsList className="bg-transparent border-b-[2px] h-16 w-full justify-between mb-4">
                <PipelineInfoBar pipelineId={pipelineid} subAccountId={subaccountid} pipelines={pipelines} />
                <div className="flex items-center gap-2">
                    <TabsTrigger value="view">Pipeline View</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </div>
            </TabsList>
            <TabsContent value="view">
                <PipelineView lanes={lanes} pipelineDetails={pipelineDetails} pipelineId={pipelineid} subaccountId={subaccountid} updateLanesOrder={updateLanesOrder} updateTicketsOrder={updateTicketsOrder} />
            </TabsContent>
            <TabsContent value="settings">
                <PipelineSettings pipelineId={pipelineid} pipelines={pipelines} subaccountId={subaccountid} />
            </TabsContent>
        </Tabs>
    );
};

export default Page;