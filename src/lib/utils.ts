/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function logger(...args: unknown[]) {
	console.error(...args);
}

export function getStripeOAuthLink(
	accountType: "agency" | "subaccount",
	state: string,
) {
	const baseUrl = (
		process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
	).replace(/\/+$/, "");
	return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${baseUrl}/${accountType}/&state=${state}`;
}
