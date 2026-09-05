import Link from 'next/link'
import React from 'react'

const Unauthorized = () => {
    return (
        <div className="p-4 text-center h-screen w-screen flex justify-center items-center flex-col">
            <h1 className="text-3xl md:text-6xl font-bold">Unauthorized Access!</h1>
            <p className="text-muted-foreground mt-2">
                Please contact support or the agency owner to get access.
            </p>
            <Link
                href="/"
                className="mt-4 bg-primary text-white p-2 px-4 rounded-md"
            >
                Back to Home
            </Link>
        </div>
    )
}

export default Unauthorized
