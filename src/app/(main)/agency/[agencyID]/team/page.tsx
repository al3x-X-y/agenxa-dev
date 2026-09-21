import { db } from '@/lib/db'
import React from 'react'
import DataTable from './data-table'
import { Plus } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { columns } from './column'
import SendInvitation from '@/components/forms/send-invitation'
import { getAgencyPlanLimits } from '@/lib/plan-limits'
import UpgradeModal from '@/components/global/upgrade-modal'

type Props = {
    params: Promise<{ agencyID: string }>
}

const TeamPage = async ({ params }: Props) => {
    const { agencyID } = await params
    const authUser = await currentUser()
    const teamMembers = await db.user.findMany({
        where: {
            Agency: {
                id: agencyID
            },
        },
        include: {
            Agency: {
                include: {
                    SubAccount: true,
                }
            },
            Permissions: {
                include: {
                    SubAccount: true,
                }
            },

        }
    })

    if (!authUser) return null

    const agencyDetails = await db.agency.findUnique({
        where: {
            id: agencyID,
        },
        include: {
            SubAccount: true,
        }
    })
    if (!agencyDetails) return null

    const limits = await getAgencyPlanLimits(agencyID)

    return (
        <div className="flex flex-col gap-4">
            {limits.planTitle === 'Starter' && (
                <div className="flex items-center justify-between p-3 px-4 rounded-lg bg-muted/40 border border-border text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Starter Plan:</span>
                        <span className="text-muted-foreground">
                            {limits.currentTeamMembers} / {limits.maxTeamMembers} Team Members used
                        </span>
                    </div>
                    {limits.isAtTeamMemberLimit && (
                        <span className="text-xs font-medium text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                            Limit reached — upgrade for unlimited members
                        </span>
                    )}
                </div>
            )}
            <DataTable
                actionButtonText={
                    <>
                        <Plus size={15} />
                        Add
                    </>
                }
                modalChildren={
                    limits.isAtTeamMemberLimit ? (
                        <UpgradeModal
                            agencyId={agencyDetails.id}
                            limitType="teamMembers"
                        />
                    ) : (
                        <SendInvitation agencyId={agencyDetails.id} />
                    )
                }
                filterValue="name"
                columns={columns}
                data={teamMembers}
            />
        </div>
    )
}

export default TeamPage