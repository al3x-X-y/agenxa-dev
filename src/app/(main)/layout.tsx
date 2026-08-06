import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import { dark } from '@clerk/themes'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
    <ClerkProvider appearance={{  theme: dark  }}>{children}</ClerkProvider>
)
}

export default Layout