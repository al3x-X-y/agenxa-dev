import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { auth, currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function Page({searchParams}: {
  searchParams:{plan:Plan; state:string; code: string}}) {
  // If the user isn't logged in, they are redirected to the sign-in page
  
  const agencyId = await verifyAndAcceptInvitation()
  console.log(agencyId)

  //get users details - code will decide where to redirect agency account or subaccount
  const user = await getAuthUserDetails()
  
  return (
    <div>Agency</div>
  )
}