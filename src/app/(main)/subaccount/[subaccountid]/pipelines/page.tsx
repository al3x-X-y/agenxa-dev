import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
    params: Promise<{
        subaccountid: string;
    }>;
};

const Pipelines = async ({ params }: Props) => {
    const { subaccountid } = await params;
    const pipelineExits = await db.pipeline.findFirst({
        where: {
            subAccountId: subaccountid,
        },
    });

    if (pipelineExits) {
        return redirect(`/subaccount/${subaccountid}/pipelines/${pipelineExits.id}`);
    }

    try {
        const response = await db.pipeline.create({
            data: {
                name: `First Pipeline`,
                subAccountId: subaccountid,
            },
        });

        return redirect(`/subaccount/${subaccountid}/pipelines/${response.id}`);
    } catch (err) {
        console.error(err);
    }
};

export default Pipelines;