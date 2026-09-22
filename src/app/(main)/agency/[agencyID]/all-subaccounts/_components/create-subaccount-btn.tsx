'use client'

import SubAccountDetails from '@/components/forms/subaccount-details'
import CustomModal from '@/components/global/custom-modal'
import UpgradeModal from '@/components/global/upgrade-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { Agency, AgencySidebarOption, SubAccount, User } from '@prisma/client'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    user: User & {
        Agency: | (
            | Agency
            | (null & {
                SubAccount: SubAccount[]
                SideBarOption: AgencySidebarOption[]
            })
        ) | null

    }
    id: string
    className: string
    isAtLimit?: boolean
}

const CreateSubaccountButton = ({className, id, user, isAtLimit}: Props) => {
    const { setOpen } = useModal()
    const agencyDetails = user.Agency

    if(!agencyDetails) return

    const handleOpenModal = () => {
        if (isAtLimit) {
            setOpen(
                <CustomModal
                    title="Upgrade Plan"
                    subheading="Starter Plan Limit Reached"
                >
                    <UpgradeModal
                        agencyId={id}
                        limitType="subaccounts"
                    />
                </CustomModal>
            )
            return
        }

        setOpen(
            <CustomModal
                title="Create a Subaccount"
                subheading="You can switch between subaccounts later on."
            >
                <SubAccountDetails 
                    agencyDetails={agencyDetails} 
                    userId={user.id} 
                    userName={user.name}
                />
            </CustomModal>
        )
    }

    return (
        <Button
            className={twMerge('w-full flex gap-4', className)}
            onClick={handleOpenModal}
        >
            <PlusCircleIcon size={15}/>
            Create Sub Account
        </Button>
    )
}

export default CreateSubaccountButton