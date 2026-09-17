import BlurPage from "@/components/global/blur-page";
import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import React from "react";

type Props = {
    params: Promise<{ subaccountid: string }>
}

const MediaPage = async ({ params }: Props) => {
    const { subaccountid } = await params;
    const data = await getMedia(subaccountid);

    return (
        <BlurPage>
            <MediaComponent data={data} subaccountId={subaccountid} />
        </BlurPage>
    );
};

export default MediaPage;