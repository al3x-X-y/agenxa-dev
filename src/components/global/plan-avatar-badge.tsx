/** @format */

"use client";

import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { AgencyPlanLimits } from "@/lib/plan-limits";
import { Crown, Star, Sparkles, CheckCircle2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Props = {
	agencyId?: string;
	planLimits?: AgencyPlanLimits | null;
};

const PlanAvatarBadge: React.FC<Props> = ({ agencyId, planLimits }) => {
	const { user } = useUser();

	const planTitle = planLimits?.planTitle || "Starter";
	const isUnlimited = planTitle === "Unlimited Saas";
	const isBasic = planTitle === "Basic";
	const isStarter = planTitle === "Starter";

	const billingUrl = agencyId ? `/agency/${agencyId}/billing` : "/agency";

	return (
		<HoverCard openDelay={150} closeDelay={200}>
			<HoverCardTrigger asChild>
				<div className="flex items-center cursor-pointer select-none group">
					{/* Avatar with Custom Animated Tier Ring & Corner Status Emblem */}
					<div className="relative flex items-center justify-center">
						{isUnlimited && (
							<>
								{/* Outer fiery conic spinning aura */}
								<div className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#9333ea,#6366f1,#06b6d4,#f59e0b,#ef4444,#9333ea)] opacity-85 blur-[3px] animate-[spin_5s_linear_infinite]" />
								{/* Counter-rotating subtle flame layer */}
								<div className="absolute -inset-[2px] rounded-full bg-[conic-gradient(from_180deg,#f59e0b,#ef4444,#9333ea,#6366f1,#06b6d4,#f59e0b)] opacity-75 animate-[spin_3.5s_linear_infinite_reverse]" />
								{/* Masking container */}
								<div className="relative rounded-full p-[2px] bg-background shadow-[0_0_14px_rgba(147,51,234,0.6)]">
									<UserButton />
								</div>
								{/* King Crown corner emblem */}
								<div
									title="Unlimited SaaS VIP"
									className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.95)] ring-1.5 ring-background animate-pulse">
									<Crown size={11} className="fill-amber-950 text-amber-950 stroke-[2.5]" />
								</div>
							</>
						)}

						{isBasic && (
							<>
								<div className="absolute -inset-[2px] rounded-full bg-emerald-500/40 blur-[2px] animate-pulse" />
								<div className="relative rounded-full p-[2px] bg-background ring-2 ring-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.45)]">
									<UserButton />
								</div>
								{/* Star corner emblem for Basic Plan */}
								<div
									title="Basic Plan"
									className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.9)] ring-1.5 ring-background">
									<Star size={9} className="fill-white text-white" />
								</div>
							</>
						)}

						{isStarter && (
							<div className="relative rounded-full p-[2px] bg-background ring-1 ring-border/80 hover:ring-primary/50 transition-all">
								<UserButton />
							</div>
						)}
					</div>
				</div>
			</HoverCardTrigger>

			{/* Glassmorphic Hover Popover Card */}
			<HoverCardContent
				align="end"
				sideOffset={12}
				className="w-80 p-0 overflow-hidden bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl">
				{/* Top Decorative Header */}
				<div
					className={`p-4 pb-3 border-b ${
						isUnlimited
							? "bg-gradient-to-br from-purple-950/70 via-indigo-950/40 to-background border-purple-500/30"
							: isBasic
								? "bg-gradient-to-br from-emerald-950/60 via-emerald-900/30 to-background border-emerald-500/20"
								: "bg-gradient-to-br from-zinc-900/60 to-background border-border/50"
					}`}>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							{isUnlimited && <Crown size={16} className="text-amber-400 fill-amber-400/20" />}
							{isBasic && <Star size={16} className="text-emerald-400 fill-emerald-400/20" />}
							<span
								className={`text-xs font-bold uppercase tracking-wider ${
									isUnlimited
										? "text-purple-300"
										: isBasic
											? "text-emerald-400"
											: "text-muted-foreground"
								}`}>
								{isUnlimited
									? "Ultimate SaaS VIP"
									: isBasic
										? "Basic Plan"
										: "Starter Plan"}
							</span>
						</div>
						<span className="text-[10px] text-muted-foreground uppercase px-2 py-0.5 rounded bg-background/50 border border-border/50">
							Active
						</span>
					</div>

					<div className="mt-2.5">
						<h4 className="font-semibold text-sm text-foreground truncate">
							{user?.fullName || user?.firstName || "Account Owner"}
						</h4>
						<p className="text-xs text-muted-foreground truncate">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>

				{/* Features & Quota Breakdown */}
				<div className="p-4 space-y-3">
					{isStarter && (
						<div className="space-y-2 text-xs">
							<div className="flex items-center justify-between py-1 border-b border-border/40">
								<span className="text-muted-foreground">Sub Accounts</span>
								<span className="font-semibold text-foreground">
									{planLimits?.currentSubaccounts ?? 0} / {planLimits?.maxSubaccounts ?? 3}
								</span>
							</div>
							<div className="flex items-center justify-between py-1 border-b border-border/40">
								<span className="text-muted-foreground">Team Members</span>
								<span className="font-semibold text-foreground">
									{planLimits?.currentTeamMembers ?? 0} / {planLimits?.maxTeamMembers ?? 2}
								</span>
							</div>
							<div className="flex items-center justify-between py-1">
								<span className="text-muted-foreground">Pipelines</span>
								<span className="font-semibold text-emerald-500">Unlimited</span>
							</div>
						</div>
					)}

					{isBasic && (
						<div className="space-y-1.5 text-xs text-muted-foreground">
							<div className="flex items-center gap-2 text-foreground">
								<CheckCircle2 size={14} className="text-emerald-500" />
								<span>Unlimited Sub Accounts</span>
							</div>
							<div className="flex items-center gap-2 text-foreground">
								<CheckCircle2 size={14} className="text-emerald-500" />
								<span>Unlimited Team Members</span>
							</div>
							<div className="flex items-center gap-2 text-foreground">
								<CheckCircle2 size={14} className="text-emerald-500" />
								<span>Unlimited Pipelines</span>
							</div>
						</div>
					)}

					{isUnlimited && (
						<div className="space-y-1.5 text-xs text-muted-foreground">
							<div className="flex items-center gap-2 text-foreground">
								<Crown size={14} className="text-amber-400" />
								<span>All Pro Features & Rebilling Unlocked</span>
							</div>
							<div className="flex items-center gap-2 text-foreground">
								<CheckCircle2 size={14} className="text-emerald-500" />
								<span>Unlimited Sub Accounts & Members</span>
							</div>
							<div className="flex items-center gap-2 text-foreground">
								<CheckCircle2 size={14} className="text-emerald-500" />
								<span>24/7 Priority Support</span>
							</div>
						</div>
					)}

					{/* Action CTA */}
					<div className="pt-2">
						<Link href={billingUrl} className="block w-full">
							<Button
								size="sm"
								className={`w-full text-xs font-semibold flex items-center justify-center gap-1.5 ${
									isStarter
										? "bg-primary hover:bg-primary/90 text-primary-foreground"
										: "bg-muted/70 hover:bg-muted text-foreground border border-border"
								}`}>
								{isStarter ? (
									<>
										<Sparkles size={13} />
										Upgrade to Unlimited
									</>
								) : (
									<>
										Manage Subscription
										<ArrowUpRight size={13} />
									</>
								)}
							</Button>
						</Link>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
};

export default PlanAvatarBadge;
