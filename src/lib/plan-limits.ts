/** @format */

import { db } from "@/lib/db";
import { pricingCards } from "@/lib/constants";

export type PlanTitle = "Starter" | "Basic" | "Unlimited Saas";

export type AgencyPlanLimits = {
	planTitle: PlanTitle;
	active: boolean;
	priceId: string;
	maxSubaccounts: number;
	maxTeamMembers: number;
	currentSubaccounts: number;
	currentTeamMembers: number;
	isAtSubaccountLimit: boolean;
	isAtTeamMemberLimit: boolean;
	hasUnlimitedPipelines: true;
};

export const STARTER_MAX_SUBACCOUNTS = 3;
export const STARTER_MAX_TEAM_MEMBERS = 2;

export async function getAgencyPlanLimits(
	agencyId: string,
): Promise<AgencyPlanLimits> {
	const agency = await db.agency.findUnique({
		where: { id: agencyId },
		include: {
			Subscription: true,
			SubAccount: {
				select: { id: true },
			},
			users: {
				select: { id: true, role: true },
			},
			Invitation: {
				where: { status: "PENDING" },
				select: { id: true },
			},
		},
	});

	if (!agency) {
		throw new Error(`Agency not found: ${agencyId}`);
	}

	const isSubscriptionActive = agency.Subscription?.active === true;
	const priceId = agency.Subscription?.priceId || "";

	// Match plan title from pricingCards or default
	let planTitle: PlanTitle = "Starter";
	if (isSubscriptionActive) {
		const matchedCard = pricingCards.find((c) => c.priceId === priceId);
		if (matchedCard?.title === "Unlimited Saas") {
			planTitle = "Unlimited Saas";
		} else if (matchedCard?.title === "Basic") {
			planTitle = "Basic";
		} else {
			// Any other active paid subscription gets unlimited tier
			planTitle = "Unlimited Saas";
		}
	}

	const isPaidPlan = isSubscriptionActive && planTitle !== "Starter";

	const maxSubaccounts = isPaidPlan ? Infinity : STARTER_MAX_SUBACCOUNTS;
	const maxTeamMembers = isPaidPlan ? Infinity : STARTER_MAX_TEAM_MEMBERS;

	const currentSubaccounts = agency.SubAccount.length;
	// Count invited team members (excluding agency owner) + pending invitations
	const currentTeamMembers =
		agency.users.filter((u) => u.role !== "AGENCY_OWNER").length +
		agency.Invitation.length;

	const isAtSubaccountLimit = currentSubaccounts >= maxSubaccounts;
	const isAtTeamMemberLimit = currentTeamMembers >= maxTeamMembers;

	return {
		planTitle,
		active: isSubscriptionActive,
		priceId,
		maxSubaccounts,
		maxTeamMembers,
		currentSubaccounts,
		currentTeamMembers,
		isAtSubaccountLimit,
		isAtTeamMemberLimit,
		hasUnlimitedPipelines: true,
	};
}
