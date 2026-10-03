/** @format */

import React from "react";
import { stripe } from "@/lib/stripe";
import { addOnProducts, pricingCards } from "@/lib/constants";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import PricingCard from "./_components/pricing-card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import clsx from "clsx";
import SubscriptionHelper from "./_components/subsciption-helper";

type Props = {
	params: Promise<{ agencyID: string }>;
	searchParams?: Promise<{
		plan?: string;
		payment_intent?: string;
		redirect_status?: string;
	}>;
};

const page = async ({ params, searchParams }: Props) => {
	const { agencyID } = await params;
	const resolvedSearchParams = searchParams ? await searchParams : undefined;
	const paymentSucceeded =
		resolvedSearchParams?.redirect_status === "succeeded";

	//CHALLENGE : Create the add on products
	const addOns = await stripe.products.list({
		ids: addOnProducts.map((product) => product.id),
		expand: ["data.default_price"],
	});

	const agencySubscription = await db.agency.findUnique({
		where: {
			id: agencyID,
		},
		select: {
			customerId: true,
			Subscription: true,
		},
	});

	const prices = await stripe.prices.list({
		product:
			process.env.NEXT_PLURA_PRODUCT_ID ||
			process.env.NEXT_AGENXA_PRODUCT_ID,
		active: true,
	});

	const currentPlanDetails = pricingCards.find(
		(c) => c.priceId === agencySubscription?.Subscription?.priceId,
	);

	const charges = agencySubscription?.customerId
		? await stripe.charges.list({
				limit: 50,
				customer: agencySubscription.customerId,
			})
		: { data: [] };

	const allCharges = [
		...charges.data.map((charge) => ({
			description: charge.description,
			id: charge.id,
			date: `${new Date(charge.created * 1000).toLocaleTimeString()} ${new Date(
				charge.created * 1000,
			).toLocaleDateString()}`,
			status: "Paid",
			amount: `$${charge.amount / 100}`,
		})),
	];

	const plainPrices = JSON.parse(JSON.stringify(prices.data));
	console.log(agencySubscription);

	return (
		<>
			{paymentSucceeded && (
				<div className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
					Payment completed successfully! Your subscription and plan are now active.
				</div>
			)}
			<SubscriptionHelper 
			prices={prices.data}
			customerId={agencySubscription?.customerId || ''}
			planExists={agencySubscription?.Subscription?.active === true}
			/>
			<h1 className="text-4xl p-4">Billing</h1>
			<Separator className=" mb-6" />
			<h2 className="text-2xl p-4">Current Plan</h2>
			<div className="flex flex-col lg:!flex-row justify-between gap-8">
				<PricingCard
					agencyId={agencyID}
					planExists={
						agencySubscription?.Subscription?.active === true
					}
					prices={plainPrices}
					customerId={agencySubscription?.customerId || ""}
					amt={
						agencySubscription?.Subscription?.active === true
							? currentPlanDetails?.price || "$0"
							: "$0"
					}
					buttonCta={
						agencySubscription?.Subscription?.active === true
							? "Change Plan"
							: "Get Started"
					}
					highlightDescription="Want to modify your plan? You can do this here. If you have further question contact support@axenga.com"
					highlightTitle="Plan Options"
					description={
						agencySubscription?.Subscription?.active === true
							? currentPlanDetails?.description ||
								"Lets get started"
							: "Lets get started! Pick a plan that works best for you."
					}
					duration="/ month"
					features={
						agencySubscription?.Subscription?.active === true
							? currentPlanDetails?.features || []
							: pricingCards.find(
									(card) => card.title === "Starter",
								)?.features || []
					}
					title={
						agencySubscription?.Subscription?.active === true
							? currentPlanDetails?.title || "Starter"
							: "Starter"
					}
				/>
				{addOns.data.map((addOn) => (
					<PricingCard
						agencyId={agencyID}
						planExists={
							agencySubscription?.Subscription?.active === true
						}
						prices={plainPrices}
						customerId={agencySubscription?.customerId || ""}
						key={addOn.id}
						amt={
							//@ts-ignore
							addOn.default_price?.unit_amount
								? //@ts-ignore
									`$${addOn.default_price.unit_amount / 100}`
								: "$0"
						}
						buttonCta="Subscribe"
						description="Dedicated support line & teams channel for support"
						duration="/ month"
						features={[]}
						title={"24/7 priority support"}
						highlightTitle="Get support now!"
						highlightDescription="Get priority support and skip the long long with the click of a button."
					/>
				))}
			</div>
			<h2 className="text-2xl p-4">Payment History</h2>
			<Table className="bg-card border-[1px] border-border rounded-md">
				<TableHeader className="rounded-md">
					<TableRow>
						<TableHead className="w-[200px]">Description</TableHead>
						<TableHead className="w-[200px]">Invoice Id</TableHead>
						<TableHead className="w-[300px]">Date</TableHead>
						<TableHead className="w-[200px]">Paid</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="font-medium truncate">
					{allCharges.map((charge) => (
						<TableRow key={charge.id}>
							<TableCell>{charge.description}</TableCell>
							<TableCell className="text-muted-foreground">
								{charge.id}
							</TableCell>
							<TableCell>{charge.date}</TableCell>
							<TableCell>
								<p
									className={clsx("", {
										"text-emerald-500":
											charge.status.toLowerCase() ===
											"paid",
										"text-orange-600":
											charge.status.toLowerCase() ===
											"pending",
										"text-red-600":
											charge.status.toLowerCase() ===
											"failed",
									})}>
									{charge.status.toUpperCase()}
								</p>
							</TableCell>
							<TableCell className="text-right">
								{charge.amount}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</>
	);
};

export default page;
