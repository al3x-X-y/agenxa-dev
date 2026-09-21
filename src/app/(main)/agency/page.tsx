/** @format */

import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import AgencyDetails from "@/components/forms/agency-details";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{
		plan?: Plan;
		state?: string;
		code?: string;
		payment_intent?: string;
		payment_intent_client_secret?: string;
		redirect_status?: string;
	}>;
}) {
	// If the user isn't logged in, they are redirected to the sign-in page

	const resolvedSearchParams = await searchParams;

	const agencyId = await verifyAndAcceptInvitation();

	//get users details - code will decide where to redirect agency account or subaccount
	const user = await getAuthUserDetails();
	if (agencyId) {
		if (
			user?.role === "SUBACCOUNT_GUEST" ||
			user?.role === "SUBACCOUNT_USER"
		) {
			return redirect("/subaccount");
		} else if (
			user?.role === "AGENCY_OWNER" ||
			user?.role === "AGENCY_ADMIN"
		) {
			if (resolvedSearchParams.plan) {
				return redirect(
					`/agency/${agencyId}/billing?plan=${resolvedSearchParams.plan}`,
				);
			}
			if (
				resolvedSearchParams.payment_intent ||
				resolvedSearchParams.redirect_status
			) {
				const query = new URLSearchParams();
				if (resolvedSearchParams.payment_intent) {
					query.set(
						"payment_intent",
						resolvedSearchParams.payment_intent,
					);
				}
				if (resolvedSearchParams.payment_intent_client_secret) {
					query.set(
						"payment_intent_client_secret",
						resolvedSearchParams.payment_intent_client_secret,
					);
				}
				if (resolvedSearchParams.redirect_status) {
					query.set(
						"redirect_status",
						resolvedSearchParams.redirect_status,
					);
				}
				return redirect(
					`/agency/${agencyId}/billing?${query.toString()}`,
				);
			}
			if (resolvedSearchParams.state) {
				const statePath = resolvedSearchParams.state.split("___")[0];
				const stateAgencyId =
					resolvedSearchParams.state.split("___")[1];
				if (!stateAgencyId) return <div>Not Authorized</div>;
				return redirect(
					`/agency/${stateAgencyId}/${statePath}?code=${resolvedSearchParams.code}`,
				);
			} else return redirect(`/agency/${agencyId}`);
		} else {
			return <div>Not authorized</div>;
		}
	}
	const authUser = await currentUser();
	return (
		<div className="flex justify-center items-center mt-4">
			<div className="max-w-212.5 border p-4 around-xl">
				<h1 className="text-4xl">Create An Agency</h1>
				<AgencyDetails
					data={{
						companyEmail: authUser?.emailAddresses[0].emailAddress,
					}}
				/>
			</div>
		</div>
	);
}
