import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { getAuthUserDetails } from '@/lib/queries'
import { getAgencyPlanLimits } from '@/lib/plan-limits'
import { SubAccount } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DeleteButton from './_components/delete-button'
import CreateSubaccountButton from './_components/create-subaccount-btn'

type Props = {
    params: Promise<{ agencyID: string }>
}

const AllSubaccountsPage = async ({ params }: Props) => {
    const { agencyID } = await params
    const user = await getAuthUserDetails()
    if (!user) return

    const limits = await getAgencyPlanLimits(agencyID)

    return (
        <AlertDialog>
            <div className='flex flex-col'>
                <div className='flex items-center justify-between m-6'>
                    {limits.planTitle === 'Starter' && (
                        <div className='text-xs text-muted-foreground bg-muted/50 border border-border px-3 py-1.5 rounded-full'>
                            <span className='font-semibold text-foreground'>
                                {limits.currentSubaccounts} / {limits.maxSubaccounts}
                            </span>{' '}
                            Subaccounts used (Starter Plan)
                        </div>
                    )}
                    <CreateSubaccountButton
                        user={user}
                        id={agencyID}
                        isAtLimit={limits.isAtSubaccountLimit}
                        className='w-[200px] ml-auto'
                    />
                </div>
                <Command className="rounded-lg bg-transparent">
                    <CommandInput
                        placeholder='Search Account...'
                    />
                    <CommandList className="max-h-none overflow-visible pb-24">
                        <CommandEmpty>No result found.</CommandEmpty>
                        <CommandGroup heading="Sub Accounts">
                            {!!user.Agency?.SubAccount.length ? user.Agency.SubAccount.map((subaccount: SubAccount) => (
                                <CommandItem
                                    key={subaccount.id}
                                    className='h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all'
                                >
                                    <Link href={`/subaccount/${subaccount.id}`}
                                        className='flex gap-4 w-full h-full'
                                    >
                                        <div className='relative w-32'>
                                            <Image
                                                src={subaccount.subAccountLogo || '/assets/agenxa-logo.svg'}
                                                alt="subaccount logo"
                                                fill
                                                className='rounded-md object-contain bg-muted/50 p-4'
                                            />
                                        </div>
                                        <div className='flex flex-col justify-between'>
                                            <div className='flex flex-col'>
                                                {subaccount.name}
                                                <span className='text-muted-foreground text-xs'> {subaccount.address}</span>
                                            </div>
                                        </div>
                                    </Link>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className='text-red-600 w-20 hover:bg-red-600 hover:text-white'
                                        >
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className='text-left'>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription className='text-left'>
                                                This action cannot be undone. This will also delete the subaccount and all data related to the subaccount
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className='flex items-center'>
                                            <AlertDialogCancel className='mb-2'>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className='bg-destructive hover:bg-destructive'>
                                                <DeleteButton subaccountId={subaccount.id} />
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>

                                </CommandItem>
                            ))
                                : (
                                    <div className='text-muted-foreground text-center p-4'
                                    >No subaccounts found</div>
                                )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </div>
        </AlertDialog>
    )
}

export default AllSubaccountsPage