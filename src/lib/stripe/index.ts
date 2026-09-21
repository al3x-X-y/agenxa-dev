/** @format */

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
	// @ts-ignore
	apiVersion: "2025-01-27.acacia",
	appInfo: {
		name: "Agenxa",
		version: "0.1.0",
	},
});
