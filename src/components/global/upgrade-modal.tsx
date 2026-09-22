/** @format */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2 } from "lucide-react";

type Props = {
	agencyId: string;
	title?: string;
	description?: string;
	limitType?: "subaccounts" | "teamMembers";
};

const UpgradeModal = ({
	agencyId,
	title,
	description,
	limitType = "subaccounts",
}: Props) => {
	const { setClose } = useModal();
	const router = useRouter();

	const defaultTitle =
		limitType === "subaccounts"
			? "Subaccount Limit Reached"
			: "Team Member Limit Reached";

	const defaultDescription =
		limitType === "subaccounts"
			? "The Starter plan includes up to 3 sub accounts. Upgrade to our Basic or Unlimited SaaS plan to unlock unlimited sub accounts and team members."
			: "The Starter plan allows up to 2 team members. Upgrade to our Basic or Unlimited SaaS plan to invite unlimited team members.";

	const handleUpgrade = () => {
		setClose();
		router.push(`/agency/${agencyId}/billing`);
	};

	return (
		<div className="flex flex-col gap-6 py-4">
			<div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
				<div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
					<Sparkles size={20} />
				</div>
				<div>
					<h3 className="font-semibold text-lg">
						{title || defaultTitle}
					</h3>
					<p className="text-sm text-muted-foreground">
						{description || defaultDescription}
					</p>
				</div>
			</div>

			<div className="space-y-3">
				<h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
					Upgrade to unlock:
				</h4>
				<ul className="space-y-2 text-sm">
					<li className="flex items-center gap-2">
						<CheckCircle2 size={16} className="text-emerald-500" />
						<span className="font-medium">
							Unlimited Sub Accounts
						</span>
					</li>
					<li className="flex items-center gap-2">
						<CheckCircle2 size={16} className="text-emerald-500" />
						<span className="font-medium">
							Unlimited Team Members
						</span>
					</li>
					<li className="flex items-center gap-2">
						<CheckCircle2 size={16} className="text-emerald-500" />
						<span>Unlimited Pipelines (Included in all plans)</span>
					</li>
					<li className="flex items-center gap-2">
						<CheckCircle2 size={16} className="text-emerald-500" />
						<span>24/7 Priority Support & Rebilling (Unlimited SaaS)</span>
					</li>
				</ul>
			</div>

			<div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
				<Button variant="outline" onClick={setClose}>
					Cancel
				</Button>
				<Button
					onClick={handleUpgrade}
					className="bg-primary hover:bg-primary/90 flex items-center gap-2">
					<Sparkles size={16} />
					Upgrade Plan
				</Button>
			</div>
		</div>
	);
};

export default UpgradeModal;
