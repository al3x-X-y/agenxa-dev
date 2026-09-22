/** @format */

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { subscriptionCreate } from "@/lib/stripe/stripe-actions";

const stripeWebhookEvents = new Set([
	"product.created",
	"product.updated",
	"price.created",
	"price.updated",
	"checkout.session.completed",
	"customer.subscription.created",
	"customer.subscription.updated",
	"customer.subscription.deleted",
]);

export async function POST(req: NextRequest) {
	let stripeEvent: Stripe.Event;
	const body = await req.text();
	const headerList = await headers();
	const sig = headerList.get("Stripe-Signature");
	const webhookSecret =
		process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
		process.env.STRIPE_WEBHOOK_SECRET;
	try {
		if (!sig || !webhookSecret) {
			console.log(
				"🔴 Error Stripe webhook secret or the signature does not exist.",
			);
			return new NextResponse("Missing Stripe signature or secret", {
				status: 400,
			});
		}
		stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
	} catch (error: any) {
		console.log(`🔴 Error ${error.message}`);
		return new NextResponse(`Webhook Error: ${error.message}`, {
			status: 400,
		});
	}

	try {
		if (stripeWebhookEvents.has(stripeEvent.type)) {
			const subscription = stripeEvent.data.object as Stripe.Subscription;
			if (
				!subscription?.metadata?.connectAccountPayments &&
				!subscription?.metadata?.connectAccountSubscriptions
			) {
				switch (stripeEvent.type) {
					case "customer.subscription.created":
					case "customer.subscription.updated": {
						if (subscription.status === "active") {
							const customerId =
								typeof subscription.customer === "string"
									? subscription.customer
									: subscription.customer?.id;
							if (customerId) {
								await subscriptionCreate(
									subscription,
									customerId,
								);
								console.log(
									"CREATED FROM WEBHOOK 💳",
									subscription,
								);
							}
						} else {
							console.log(
								"SKIPPED AT CREATED FROM WEBHOOK 💳 because subscription status is not active",
								subscription,
							);
						}
						break;
					}
					default:
						console.log(
							"👉 Unhandled relevant event!",
							stripeEvent.type,
						);
						break;
				}
			} else {
				console.log(
					"SKIPPED FROM WEBHOOK 💳 because subscription was from a connected account not for the application",
					subscription,
				);
			}
		}

		return NextResponse.json({ received: true }, { status: 200 });
	} catch (error) {
		console.log(error);
		return new NextResponse("🔴 Webhook Error", { status: 500 });
	}
}

