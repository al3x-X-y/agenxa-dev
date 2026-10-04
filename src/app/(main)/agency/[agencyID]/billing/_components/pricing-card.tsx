/** @format */

"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import { useModal } from "@/providers/modal-provider";
import { useParams, useSearchParams } from "next/navigation";
import type { PricesList } from "@/lib/types";
import CustomModal from "@/components/global/custom-modal";
import SubscriptionFormWrapper from "@/components/forms/subscription-form/subscription-form-wrapper";

type Props = {
	features: string[];
	buttonCta: string;
	title: string;
	description: string;
	amt: string;
	duration: string;
	highlightTitle: string;
	highlightDescription: string;
	customerId: string;
	prices: PricesList["data"];
	planExists: boolean;
	agencyId?: string;
};

const PricingCard = ({
	agencyId,
	amt,
	buttonCta,
	customerId,
	description,
	duration,
	features,
	highlightDescription,
	highlightTitle,
	planExists,
	prices,
	title,
}: Props) => {
	const { setOpen } = useModal();
	const searchParams = useSearchParams();
	const params = useParams();
	const plan = searchParams.get("plan");
	const effectiveAgencyId =
		agencyId || (params?.agencyID as string) || "";

	const handleManagePlan = async () => {
		setOpen(
			<CustomModal
				title={"Manage Your Plan"}
				subheading="You can change your plan at any time from the billings settings">
				<SubscriptionFormWrapper
					customerId={customerId}
					planExists={planExists}
					agencyId={effectiveAgencyId}
				/>
			</CustomModal>,
			async () => ({
				plans: {
					defaultPriceId: plan ? plan : "",
					plans: prices,
				},
			}),
		);
	};

	return (
		<Card className="flex flex-col justify-between lg:w-1/2">
			<div>
				<CardHeader className="flex flex-col md:!flex-row justify-between">
					<div>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</div>
					<p className="text-6xl font-bold">
						{amt}
						<small className="text-xs font-light text-muted-foreground">
							{duration}
						</small>
					</p>
				</CardHeader>
				<CardContent>
					<ul>
						{features.map((feature) => (
							<li
								key={feature}
								className="list-disc ml-4 text-muted-foreground">
								{feature}
							</li>
						))}
					</ul>
				</CardContent>
			</div>
			<CardFooter>
				<Card className="w-full flex justify-between p-4 bg-muted/40 rounded-lg">
					<div>
						<div className="font-bold">{highlightTitle}</div>
						<div className="text-sm text-muted-foreground">
							{highlightDescription}
						</div>
					</div>
					<Button
						className="md:w-fit w-full"
						onClick={handleManagePlan}>
						{buttonCta}
					</Button>
				</Card>
			</CardFooter>
		</Card>
	);
};

export default PricingCard;
