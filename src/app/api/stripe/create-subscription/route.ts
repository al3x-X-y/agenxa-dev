/** @format */

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils";

export async function POST(req: NextRequest) {
	const { priceId, customerId } = await req.json();

	if (!customerId || !priceId) {
		return new NextResponse("Customer ID or Price ID not found", {
			status: 400,
		});
	}

	const subscriptionExist = await db.agency.findFirst({
		where: {
			customerId,
		},
		include: {
			Subscription: true,
		},
	});

	try {
		if (
			subscriptionExist?.Subscription?.subscritiptionId &&
			subscriptionExist.Subscription.active
		) {
			// Update subscription instead of creating one
			if (!subscriptionExist.Subscription.subscritiptionId) {
				throw new Error("Subscription ID not found");
			}
			console.log("Updating the subscription...");

			try {
				const currentSubscriptionDetails =
					await stripe.subscriptions.retrieve(
						subscriptionExist.Subscription.subscritiptionId,
					);

				// Only attempt update if the subscription is in a usable state
				if (
					currentSubscriptionDetails.status === "active" ||
					currentSubscriptionDetails.status === "trialing"
				) {
					const updatedSubscription =
						await stripe.subscriptions.update(
							subscriptionExist.Subscription.subscritiptionId,
							{
								items: [
									{
										id: currentSubscriptionDetails.items
											.data[0].id,
										deleted: true,
									},
									{
										price: priceId,
									},
								],
								expand: ["latest_invoice.payment_intent"],
							},
						);

					const latestInvoice =
						updatedSubscription.latest_invoice as any;
					return NextResponse.json({
						subscriptionId: updatedSubscription.id,
						clientSecret:
							latestInvoice?.payment_intent?.client_secret,
					});
				}

				// Subscription exists but is not active/trialing — fall through to create new
				console.log(
					`Existing subscription ${subscriptionExist.Subscription.subscritiptionId} has status "${currentSubscriptionDetails.status}", creating new one...`,
				);
			} catch (retrieveError: any) {
				// Subscription no longer exists in Stripe (stale ID from old account/session)
				console.log(
					`Could not retrieve subscription ${subscriptionExist.Subscription.subscritiptionId}: ${retrieveError.message}. Creating new subscription...`,
				);
			}
		}

		// Create new subscription
		console.log("Creating subscription...");

		const subscription = await stripe.subscriptions.create({
			customer: customerId,
			items: [{ price: priceId }],
			// Use default_incomplete to create Subscriptions with status=incomplete when the first invoice requires payment,
			// otherwise start as active.
			// Link: https://docs.stripe.com/api/subscriptions/create#create_subscription-payment_behavior
			payment_behavior: "default_incomplete",
			// Stripe sets subscription.default_payment_method when a subscription payment succeeds.
			// Link: https://docs.stripe.com/api/subscriptions/create#create_subscription-payment_settings-save_default_payment_method
			payment_settings: {
				save_default_payment_method: "on_subscription",
			},
			expand: ["latest_invoice.payment_intent"],
		});

		const latestInvoice = subscription.latest_invoice as any;
		return NextResponse.json({
			subscriptionId: subscription.id,
			clientSecret: latestInvoice?.payment_intent?.client_secret,
		});
	} catch (error) {
		logger(error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
