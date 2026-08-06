import { auth } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  // If the user isn't logged in, they are redirected to the sign-in page
  await auth.protect()

  return (
    <div>Welcome to the protected dashboard!</div>
  )
}