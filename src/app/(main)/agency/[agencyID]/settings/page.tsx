import AgencyDetails from '@/components/forms/agency-details'
import UserDetails from '@/components/forms/user-details'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import { User } from 'lucide-react'
import React from 'react'

type Props = {
    params: Promise<{ agencyID: string }>
}

const SettingsPage = async ({ params }: Props) => {
    const { agencyID } = await params
    const authUser = await currentUser()
    if (!authUser) return null

    const userDetails = await db.user.findUnique({
        where: {
            email: authUser.emailAddresses[0].emailAddress,
        },
    })

    if (!userDetails) return null
    const agencyDetails = await db.agency.findUnique({
        where: {
            id: agencyID,
        },
        include: {
            SubAccount: true,
        },
    })

    if (!agencyDetails) return null

    const subAccounts = agencyDetails.SubAccount
    return (
        <div className='flex ld:!flex-row flex-col gap-4'>
            <AgencyDetails data={agencyDetails} />
            <UserDetails
                type="agency"
                id={agencyID}
                subAccounts={subAccounts}
                userData={userDetails}
            />
        </div>
    )
}

export default SettingsPage
