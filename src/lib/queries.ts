/** @format */

"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { redirect } from "next/navigation";
import { User, Agency, Plan, SubAccount } from "@prisma/client";
import { v4 } from "uuid";

//==============================================================================
//==============================================================================
//======================GET USER DETAIL ========================================
//=================FROM DATABASE USING AUTH DETAILS=============================
//==============================================================================
//==============================================================================

export const getAuthUserDetails = async () => {
	const user = await currentUser();
	if (!user) {
		return;
	}
	const userData = await db.user.findUnique({
		where: {
			email: user.emailAddresses[0].emailAddress,
		},
		include: {
			Agency: {
				include: {
					SidebarOption: true,
					SubAccount: {
						include: {
							SidebarOption: true,
						},
					},
				},
			},
			Permissions: true,
		},
	});
	return userData;
};

//==============================================================================
//==============================================================================
//============================= Notification WRAPPER ===========================
//==============================================================================
//==============================================================================
export const saveActivityLogsNotification = async ({
	agencyId,
	description,
	subaccountId,
}: {
	agencyId?: string;
	description: string;
	subaccountId?: string;
}) => {
	const authUser = await currentUser();
	let userData;
	if (!authUser) {
		const response = await db.user.findFirst({
			where: {
				Agency: {
					SubAccount: {
						some: { id: subaccountId },
					},
				},
			},
		});
		if (response) {
			userData = response;
		}
	} else {
		userData = await db.user.findUnique({
			where: { email: authUser?.emailAddresses[0].emailAddress },
		});
	}

	if (!userData) {
		console.log("could not find a user");
		return;
	}
	let foundAgencyId = agencyId;
	if (!foundAgencyId) {
		if (!subaccountId) {
			throw new Error(
				"You need to provide atleast an agency Id or subaccount Id",
			);
		}
		const response = await db.subAccount.findUnique({
			where: { id: subaccountId },
		});
		if (response) foundAgencyId = response.agencyId;
	}
	if (subaccountId) {
		await db.notification.create({
			data: {
				notification: `${userData.name} | ${description}`,
				User: {
					connect: {
						id: userData.id,
					},
				},
				Agency: {
					connect: {
						id: foundAgencyId,
					},
				},
				SubAccount: {
					connect: { id: subaccountId },
				},
			},
		});
	} else {
		await db.notification.create({
			data: {
				notification: `${userData.name} | ${description}`,
				User: {
					connect: {
						id: userData.id,
					},
				},
				Agency: {
					connect: {
						id: foundAgencyId,
					},
				},
			},
		});
	}
};

//==============================================================================
//==============================================================================
//========================CREATE TEAM USER =====================================
//==============================================================================
//==============================================================================

export const createTeamUser = async (agencyId: string, user: User) => {
	if (user.role == "AGENCY_OWNER") return null;
	const response = await db.user.create({ data: { ...user } });
	return response;
};

//==============================================================================
//==============================================================================
//=============VERIFY AND ACCEPT TEAM INVITATION================================
//==============================================================================
//==============================================================================

export const verifyAndAcceptInvitation = async () => {
	const user = await currentUser();
	if (!user) return redirect("/sign-in");
	const invitationExists = await db.invitation.findUnique({
		where: {
			email: user.emailAddresses[0].emailAddress,
			status: "PENDING",
		},
	});
	if (invitationExists) {
		const userDetails = await createTeamUser(invitationExists.agencyId, {
			email: invitationExists.email,
			agencyId: invitationExists.agencyId,
			avatarUrl: user.imageUrl,
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			role: invitationExists.role,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await saveActivityLogsNotification({
			agencyId: invitationExists?.agencyId,
			description: `Joined`,
			subaccountId: undefined,
		});

		if (userDetails) {
			const client = await clerkClient(); // Call and await the function first
			await client.users.updateUserMetadata(user.id, {
				privateMetadata: {
					role: userDetails.role || "SUBACCOUNT_USER",
				},
			});

			await db.invitation.delete({
				where: { email: userDetails.email },
			});

			return userDetails.agencyId;
		} else return null;
	} else {
		const agency = await db.user.findUnique({
			where: {
				email: user.emailAddresses[0].emailAddress,
			},
		});
		return agency ? agency.agencyId : null;
	}
};

//==============================================================================
//==============================================================================
//=========================UPDATE AGENCY DETAILS================================
//==============================================================================
//==============================================================================

export const updateAgencyDetails = async (
	agencyId: string,
	agencyDetails: Partial<Agency>,
) => {
	const response = await db.agency.update({
		where: { id: agencyId },
		data: {
			...agencyDetails,
		},
	});

	return response;
};

//==============================================================================
//==============================================================================
//==============================DELETE AN AGENCY================================
//==============================================================================
//==============================================================================

export const deleteAgency = async (agencyId: string) => {
	const response = await db.agency.delete({ where: { id: agencyId } });
	return response;
};

//==============================================================================
//==============================================================================
//==========================INITIALIZE AN USER==================================
//====================INSERT METADATA TO CLERK USER=============================
//==============================================================================
//==============================================================================
export const initUser = async (newUser: Partial<User>) => {
	const user = await currentUser();

	if (!user) return;

	const userData = await db.user.upsert({
		where: { email: user.emailAddresses[0].emailAddress },
		update: newUser,
		create: {
			id: user.id,
			avatarUrl: user.imageUrl,
			email: user.emailAddresses[0].emailAddress,
			name: `${user.firstName} ${user.lastName}`,
			role: newUser.role || "SUBACCOUNT_USER",
		},
	});

	const client = await clerkClient();
	await client.users.updateUserMetadata(user.id, {
		privateMetadata: {
			role: newUser.role || "SUBACCOUNT_USER",
		},
	});

	return userData;
};

//==============================================================================
//==============================================================================
//==========================UPSERT AN AGENCY====================================
//==============================================================================
//==============================================================================

export const upsertAgency = async (agency: Agency, _price?: Plan) => {
	if (!agency.companyEmail) return null;

	const agencyData = {
		id: agency.id,
		name: agency.name ?? "",
		agencyLogo: agency.agencyLogo ?? "",
		companyEmail: agency.companyEmail,
		companyPhone: agency.companyPhone ?? "",
		whiteLabel: agency.whiteLabel ?? true,
		address: agency.address ?? "",
		city: agency.city ?? "",
		zipCode: agency.zipCode ?? "",
		state: agency.state ?? "",
		country: agency.country ?? "",
		connectAccountId: agency.connectAccountId ?? "",
		goal: agency.goal ?? 5,
		createdAt: agency.createdAt ?? new Date(),
		updatedAt: agency.updatedAt ?? new Date(),
	};

	try {
		const agencyDetails = await db.agency.upsert({
			where: {
				id: agency.id,
			},
			update: {
				...agencyData,
				updatedAt: new Date(),
			},
			create: {
				...agencyData,
				users: {
					connect: { email: agency.companyEmail },
				},
				SidebarOption: {
					create: [
						{
							name: "Dashboard",
							icon: "category",
							link: `/agency/${agency.id}`,
						},
						{
							name: "Launchpad",
							icon: "clipboardIcon",
							link: `/agency/${agency.id}/launchpad`,
						},
						{
							name: "Billing",
							icon: "payment",
							link: `/agency/${agency.id}/billing`,
						},
						{
							name: "Settings",
							icon: "settings",
							link: `/agency/${agency.id}/settings`,
						},
						{
							name: "Sub Accounts",
							icon: "person",
							link: `/agency/${agency.id}/all-subaccounts`,
						},
						{
							name: "Team",
							icon: "shield",
							link: `/agency/${agency.id}/team`,
						},
					],
				},
			},
		});

		return agencyDetails;
	} catch (error) {
		console.error("upsertAgency error:", error);
		throw error;
	}
};

export const getNotificationAndUser = async (agencyId: string) => {
	try {
		const response = await db.notification.findMany({
			where: { agencyId },
			include: { User: true },
			orderBy: {
				createdAt: 'desc',
			},
		})
		return response
	} catch (error) {
		console.log(error)
	}
}
//==============================================================================
//==============================================================================
//============================= UPSERT A SUBACCOUNT ===========================
//==============================================================================
//==============================================================================

export const upsertSubAccount = async (subAccount: SubAccount) => {
	if (!subAccount.companyEmail) return null
	const agencyOwner = await db.user.findFirst({
		where: {
			Agency: {
				id: subAccount.agencyId,
			},
			role: 'AGENCY_OWNER'
		}
	})
	if (!agencyOwner) return console.log('🔴Error could not create subaccount because currently not agency owner')
	const permissionId = v4();
	const response = await db.subAccount.upsert({
		where: {
			id: subAccount.id
		},
		update: subAccount,
		create: {
			...subAccount,
			Permissions: {
				create: {
					access: true,
					email: agencyOwner.email,
					id: permissionId,
				},
				connect: {
					subAccountId: subAccount.id,
					id: permissionId
				},
			},
			Pipeline: {
				create: { name: 'Lead Cycle' },
			},
			SidebarOption: {
				create: [
					{
						name: 'Launchpad',
						icon: 'clipboardIcon',
						link: `/subaccount/${subAccount.id}/launchpad`,
					},
					{
						name: 'Settings',
						icon: 'settings',
						link: `/subaccount/${subAccount.id}/settings`,
					},
					{
						name: 'Funnels',
						icon: 'pipelines',
						link: `/subaccount/${subAccount.id}/funnels`,
					},
					{
						name: 'Media',
						icon: 'database',
						link: `/subaccount/${subAccount.id}/media`,
					},
					{
						name: 'Automations',
						icon: 'chip',
						link: `/subaccount/${subAccount.id}/automations`,
					},
					{
						name: 'Pipelines',
						icon: 'flag',
						link: `/subaccount/${subAccount.id}/pipelines`,
					},
					{
						name: 'Contacts',
						icon: 'person',
						link: `/subaccount/${subAccount.id}/contacts`,
					},
					{
						name: 'Dashboard',
						icon: 'category',
						link: `/subaccount/${subAccount.id}`,
					},
				],
			},
		}
	})
	return response
}
