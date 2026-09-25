import BlurPage from '@/components/global/blur-page'
import ClipboardIcon from '@/components/icons/clipboard-icon'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'
import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { SubAccount } from '@prisma/client'
import React from 'react'
import { Contact2, DollarSign } from 'lucide-react'

type Props = {
    params: Promise<{ subaccountid: string }>
    searchParams: Promise<{
        code?: string
    }>
}

const SubaccountPageId = async ({ params, searchParams }: Props) => {
    const { subaccountid } = await params
    const { code } = await searchParams

    let currency = 'USD'
    let sessions
    let totalClosedSessions
    let totalPendingSessions
    let net = 0
    let potentialIncome = 0
    let closingRate = 0

    const subaccountDetails = await db.subAccount.findUnique({
        where: {
            id: subaccountid,
        },
    })
    const currentYear = new Date().getFullYear()
    const startDate = new Date(`${currentYear}-01-01T00:00:00.00Z`).getTime() / 1000
    const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000
    if (!subaccountDetails) return

    if (subaccountDetails.connectAccountId) {
        const response = await stripe.accounts.retrieve(
            subaccountDetails.connectAccountId
        )

        currency = response.default_currency?.toUpperCase() || 'USD'
        const checkoutSessions = await stripe.checkout.sessions.list(
            { created: { gte: startDate, lte: endDate }, limit: 100 },
            {
                stripeAccount: subaccountDetails.connectAccountId,
            }

        )
        sessions = checkoutSessions.data.map((session) => ({
            ...session,
            created: new Date(session.created).toLocaleDateString(),
            amount_total: session.amount_total ? session.amount_total / 100 : 0,
        }))

        totalClosedSessions = checkoutSessions.data
            .filter((session) => session.status === 'complete')
            .map((session) => ({
                ...session,
                created: new Date(session.created).toLocaleDateString(),
                amount_total: session.amount_total ? session.amount_total / 100 : 0,
            }))
        totalPendingSessions = checkoutSessions.data
            .filter(
                (session) => session.status === 'open' || session.status === 'expired'
            )
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
            (totalClosedSessions.length / checkoutSessions.data.length) *
            100
        ).toFixed(2)
    }

    const funnels = await db.funnel.findMany({
        where: {
            subAccountId: subaccountid,
        },
        include: {
            FunnelPages: true,
        },
    })
    const funnelPerformanceMetrics = funnels.map((funnel) => ({
        ...funnel,
        totalFunnels: funnel.FunnelPages.reduce(
            (total, page) => total + page.visits,
            0
        ),
    }))



    return (
        <BlurPage>
            <div className="relative h-full">
                {!subaccountDetails.connectAccountId && (
                    <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
                        <Card className="w-[350px]">
                            <CardHeader>
                                <CardTitle>Connect Your Stripe</CardTitle>
                                <CardDescription>
                                    You need to connect your stripe account to see metrics
                                </CardDescription>
                                <Link
                                    href={`/subaccount/${subaccountDetails.id}/launchpad`}
                                    className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
                                >

                                    <ClipboardIcon />
                                    Launch Pad
                                </Link>
                            </CardHeader>
                        </Card>

                    </div>
                )}

                <div className="flex flex-col gap-4 pb-6">
                    <div className="flex gap-4 flex-col xl :! flex-row">
                        <Card className="flex-1 relative">
                            <CardHeader>
                                <CardDescription>Income</CardDescription>
                                <CardTitle className="text-4xl">
                                    {net ? `${currency} ${net.toFixed(2)}` : '$0.00'}
                                </CardTitle>
                                <small className="text-xs text-muted-foreground">
                                    For the year {currentYear}
                                </small>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Total revenue generated as reflected in your stripe dashboard.
                            </CardContent>
                            <DollarSign className="absolute right-4 top-4 text-muted-foreground" />
                        </Card>

                        <Card className="flex-1 relative">
                            <CardHeader>
                                <CardDescription>Potential Income</CardDescription>
                                <CardTitle className="text-4xl">
                                    {potentialIncome
                                        ? `${currency} ${potentialIncome.toFixed(2)}`
                                        : `$0.00`}
                                </CardTitle>
                                <small className="text-xs text-muted-foreground">
                                    For the year {currentYear}
                                </small>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                This is how much you can close.
                            </CardContent>
                            <Contact2 className="absolute right-4 top-4 text-muted-foreground" />
                        </Card>
                    </div>
                </div>
            </div>
        </BlurPage >
    )
}

export default SubaccountPageId