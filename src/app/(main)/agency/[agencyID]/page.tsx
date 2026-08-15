/** @format */

import React from "react";

const Page = async ({ params }: { params: Promise<{ agencyID: string }> }) => {
	const { agencyID } = await params;
	return <div>{agencyID ?? "Missing agency ID"}</div>;
};

export default Page;
