/** @format */

import ClipboardIcon from "@/components/icons/clipboard-icon";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
import React from "react";

const Page = async ({ params }:
	{
		params: Promise<{ agencyID: string }>,
		searchParams: Promise<{ code: string }>
	}) => {
	const { agencyID } = await params;
	let currency = 'USD'
	let sessions
	let totalClosedSessions
	let totalPendingSessions
	let net = 0
	let potentialIncome = 0
	let closingRate = 0
	const currentYear = new Date().getFullYear()
	const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
	const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

	const agencyDetails = await db.agency.findUnique({
		where: {
			id: agencyID,
		},
	})

	if (!agencyDetails) return

	const subaccounts = await db.subAccount.findMany({
		where: {
			agencyId: agencyID,
		},
	})

	if (agencyDetails.connectAccountId) {
		const response = await stripe.accounts.retrieve(agencyDetails.connectAccountId)

		currency = response.default_currency?.toUpperCase() || 'USD'
		const checkOutSessions = await stripe.checkout.sessions.list(
			{
				created: { gte: startDate, lte: endDate },
				limit: 100,
			},
			{ stripeAccount: agencyDetails.connectAccountId }

		)
		sessions = checkOutSessions.data
		totalClosedSessions = checkOutSessions.data
			.filter((session) => session.status === 'complete')
			.map((session) => ({
				...session,
				created: new Date(session.created).toLocaleDateString(),
				amount_total: session.amount_total ? session.amount_total / 100 : 0,
			}))

		totalPendingSessions = checkOutSessions.data
			.filter((session) => session.status === 'open')
			.map((session) => ({
				...session,
				created: new Date(session.created).toLocaleDateString(),
				amount_total: session.amount_total ? session.amount_total / 100 : 0,
			}))
		net = +totalClosedSessions
			.reduce((total, session) => total + (session.amount_total || 0), 0)
			.toFixed(2)

		potentialIncome = +totalPendingSessions
			.reduce((total, session) => total + (session.amount_total || 0), 0)
			.toFixed(2)

		closingRate = +(
			(totalClosedSessions.length / checkOutSessions.data.length) *
			100
		).toFixed(2)
	}

	return (
		<div className="relative w-full h-full">
			{!agencyDetails.connectAccountId && (
				<div className="absolute -top-10 left-0 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
					<Card className="w-[400px] max-w-[90%]">
						<CardHeader>
							<CardTitle>Connect Your Stripe</CardTitle>
							<CardDescription>
								You need to connect your stripe account to see metrics
							</CardDescription>
							<Link
								href={`/agency/${agencyDetails.id}/launchpad`}
								className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
							>
								<ClipboardIcon />
								Launch Pad
							</Link>
						</CardHeader>
					</Card>
				</div>
			)}
		</div>
	)
};

export default Page;
