/** @format */

"use client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { pricingCards } from "@/lib/constants";
import { useModal } from "@/providers/modal-provider";
import { Plan } from "@prisma/client";
import { StripeElementsOptions } from "@stripe/stripe-js";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe/stripe-client";
import Loading from "@/components/global/loading";
import SubscriptionForm from ".";

type Props = {
	customerId: string;
	planExists: boolean;
	agencyId?: string;
};

const SubscriptionFormWrapper = ({
	customerId,
	planExists,
	agencyId,
}: Props) => {
	const { data, setClose } = useModal();
	const router = useRouter();
	const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
		data?.plans?.defaultPriceId || "",
	);
	const [subscription, setSubscription] = useState<{
		subscriptionId: string;
		clientSecret: string;
	}>({ subscriptionId: "", clientSecret: "" });

	const options: StripeElementsOptions = useMemo(
		() => ({
			clientSecret: subscription?.clientSecret,
			appearance: {
				theme: "flat",
			},
		}),
		[subscription],
	);
	useEffect(() => {
		if (!selectedPriceId) return;
		setSubscription({ subscriptionId: "", clientSecret: "" });
		const createSecret = async () => {
			try {
				const subscriptionResponse = await fetch(
					"/api/stripe/create-subscription",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							customerId,
							priceId: selectedPriceId,
						}),
					},
				);

				if (!subscriptionResponse.ok) {
					toast({
						variant: "destructive",
						title: "Subscription Error",
						description:
							"Could not create subscription. Please try again or contact support.",
					});
					setSelectedPriceId("");
					return;
				}

				const subscriptionResponseData =
					await subscriptionResponse.json();

				if (!subscriptionResponseData.clientSecret) {
					// No client secret means the subscription was updated (plan change for existing subscriber)
					if (planExists) {
						toast({
							title: "Success",
							description:
								"Your plan has been successfully upgraded!",
						});
						setClose();
						router.refresh();
						return;
					}
					toast({
						variant: "destructive",
						title: "Subscription Error",
						description:
							"Could not initialize payment. Please try again.",
					});
					setSelectedPriceId("");
					return;
				}

				setSubscription({
					clientSecret: subscriptionResponseData.clientSecret,
					subscriptionId: subscriptionResponseData.subscriptionId,
				});
			} catch (error) {
				console.error("Subscription creation error:", error);
				toast({
					variant: "destructive",
					title: "Network Error",
					description:
						"Could not connect to the payment server. Please check your connection and try again.",
				});
				setSelectedPriceId("");
			}
		};
		createSecret();
	}, [selectedPriceId, customerId]);

	return (
		<div className="border-none transition-all">
			<div className="flex flex-col gap-4">
				{data.plans?.plans
					?.sort(
						(a, b) =>
							(b.unit_amount ?? 0) - (a.unit_amount ?? 0),
					)
					.map((price) => (
						<Card
							onClick={() => setSelectedPriceId(price.id as Plan)}
							key={price.id}
							className={clsx(
								"relative cursor-pointer transition-all",
								{
									"border-primary": selectedPriceId === price.id,
								},
							)}>
							<CardHeader>
								<CardTitle>
									$
									{price.unit_amount
										? price.unit_amount / 100
										: "0"}
									<p className="text-sm text-muted-foreground">
										{price.nickname}
									</p>
									<p className="text-sm text-muted-foreground">
										{
											pricingCards.find(
												(p) => p.priceId === price.id,
											)?.description
										}
									</p>
								</CardTitle>
							</CardHeader>
							{selectedPriceId === price.id && (
								<div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-4 right-4" />
							)}
						</Card>
					))}
				{options.clientSecret && !planExists && (
					<>
						<h1 className="text-xl">Payment Method</h1>
						<Elements
							key={options.clientSecret}
							stripe={getStripe()}
							options={options}>
							<SubscriptionForm
								selectedPriceId={selectedPriceId}
								agencyId={agencyId}
							/>
						</Elements>
					</>
				)}
				{!options.clientSecret && selectedPriceId && (
					<div className="flex items-center justify-center w-full h-40">
						<Loading />
					</div>
				)}
			</div>
		</div>
	);
};

export default SubscriptionFormWrapper;
