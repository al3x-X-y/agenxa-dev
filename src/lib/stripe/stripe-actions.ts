/** @format */

"use server";

import Stripe from "stripe";
import { stripe as StripeInstance } from "@/lib/stripe";
import { db } from "@/lib/db";
import { Plan, Prisma } from "@prisma/client";

export const subscriptionCreate = async (
	subscription: Stripe.Subscription,
	customerId: string,
) => {
	try {
		const agency = await db.agency.findFirst({
			where: {
				customerId,
			},
			include: {
				SubAccount: true, // Matches PascalCase in schema.prisma
			},
		});

		if (!agency) {
			throw new Error(
				"Could not find an agency to upsert the subscription",
			);
		}

		// In Stripe v22+, billing periods and prices live on SubscriptionItem
		const primaryItem = subscription.items.data[0];
		const currentPeriodEnd = primaryItem?.current_period_end ?? 0;
		const priceId = primaryItem?.price?.id ?? "";

		const data: Prisma.SubscriptionUncheckedCreateInput = {
			active: subscription.status === "active",
			agencyId: agency.id,
			customerId,
			currentPeriodEndDate: new Date(currentPeriodEnd * 1000),
			priceId,
			subscritiptionId: subscription.id,
			plan: priceId as Plan,
		};

		const response = await db.subscription.upsert({
			where: {
				agencyId: agency.id,
			},
			create: data,
			update: data,
		});

		return response;
	} catch (error) {
		console.error("Error from create action:", error);
	}
};

export const getConnectAccountProducts = async (stripeAccount: string) => {
	const products = await StripeInstance.products.list(
		{
			limit: 50,
			expand: ["data.default_price"],
		},
		{
			stripeAccount,
		},
	);

	return products.data;
};

// export const getAddOnsProducts = async () => {
// 	const addOnsProducts = await StripeInstance.products.list({
// 		ids: ADD_ONS.map((addOne) => addOne.id),
// 		expand: ["data.default_price"],
// 	});

// 	return addOnsProducts;
// };

// export const getPrices = async () => {
// 	const prices = await StripeInstance.prices.list({
// 		product: process.env.NEXT_PUBLIC_PLURA_PRODUCT_ID,
// 		active: true,
// 	});

// 	return prices;
// };

// export const getCharges = async (customerId: string | undefined) => {
// 	const charges = await StripeInstance.charges.list({
// 		limit: 50,
// 		customer: customerId,
// 	});

// 	return charges;
// };
