/** @format */

"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plan } from "@prisma/client";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useModal } from "@/providers/modal-provider";
import { useRouter } from "next/navigation";
import Loading from "@/components/global/loading";

type Props = {
	selectedPriceId: string | Plan;
	agencyId?: string;
};

const SubscriptionForm = ({ selectedPriceId, agencyId }: Props) => {
	const { toast } = useToast();
	const elements = useElements();
	const stripeHook = useStripe();
	const { setClose } = useModal();
	const router = useRouter();
	const [priceError, setPriceError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!selectedPriceId) {
			setPriceError("You need to select a plan to continue.");
			return;
		}
		setPriceError("");
		if (!stripeHook || !elements) {
			return;
		}

		setIsLoading(true);

		try {
			const baseUrl =
				typeof window !== "undefined"
					? window.location.origin
					: process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

			const returnUrl = agencyId
				? `${baseUrl}/agency/${agencyId}/billing`
				: `${baseUrl}/agency`;

			const { error, paymentIntent } = await stripeHook.confirmPayment({
				elements,
				confirmParams: {
					return_url: returnUrl,
				},
				redirect: "if_required",
			});

			if (error) {
				toast({
					variant: "destructive",
					title: "Payment failed",
					description:
						error.message ||
						"We couldn’t process your payment. Please try a different card",
				});
				setIsLoading(false);
				return;
			}

			if (
				paymentIntent &&
				(paymentIntent.status === "succeeded" ||
					paymentIntent.status === "processing")
			) {
				toast({
					title: "Payment successful",
					description:
						"Your payment has been successfully processed and your plan is active.",
				});
				setClose();
				router.refresh();
			}
		} catch (error) {
			console.error("Payment confirmation error:", error);
			toast({
				variant: "destructive",
				title: "Payment error",
				description:
					"An unexpected error occurred while processing your payment.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<small className="text-destructive">{priceError}</small>
			<PaymentElement />
			<Button
				disabled={!stripeHook || isLoading}
				className="mt-4 w-full flex items-center justify-center gap-2">
				{isLoading ? (
					<>
						<Loading />
						<span>Processing Payment...</span>
					</>
				) : (
					"Submit Payment"
				)}
			</Button>
		</form>
	);
};

export default SubscriptionForm;
