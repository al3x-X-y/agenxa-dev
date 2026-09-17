import InfoBar from '@/components/global/infobar';
import Sidebar from '@/components/sidebar';
import Unauthorized from '@/components/unauthorized';
import { getAuthUserDetails, getNotificationAndUser, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
    children: React.ReactNode
    params: Promise<{ subaccountid: string }>
}

const SubaccountLayout = async ({ children, params }: Props) => {
    const { subaccountid } = await params

    const agencyId = await verifyAndAcceptInvitation()
    if (!agencyId) {
        return <Unauthorized />
    }

    const user = await currentUser()
    if (!user) {
        return redirect('/')
    }

    let notifications: any = [];

    if (!user.privateMetadata.role) {
        return <Unauthorized />;
    } else {
        const allPermissions = await getAuthUserDetails();
        const hasPermission = allPermissions?.Permissions.find((p) => p.access && p.subAccountId === subaccountid);

        if (!hasPermission) {
            return <Unauthorized />;
        }
        const allNotifications = await getNotificationAndUser(agencyId);

        if (user.privateMetadata.role === "AGENCY_ADMIN" || user.privateMetadata.role === "AGENCY_OWNER") {
            notifications = allNotifications;
        } else {
            const filteredNoti = allNotifications?.filter((item) => item.subAccountId === subaccountid);

            if (filteredNoti) notifications = filteredNoti;
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar id={subaccountid} type="subaccount" />
            <div className="md:pl-[300px]">
                <InfoBar notifications={notifications} role={user.privateMetadata.role as Role} subAccountId={subaccountid} />
                <div className="relative">{children}</div>
            </div>
        </div>
    );
};


export default SubaccountLayout;
