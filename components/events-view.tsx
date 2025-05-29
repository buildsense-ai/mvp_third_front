"use client"

import { navigate } from "@/lib/routes"

const EventsView = () => {
  // Example usage of the updated routing functions:
  const handleNavigateToDocuments = () => {
    // router.push('/dashboard/documents'); // Original route
    router.push(navigate.toDocuments()) // Updated route
  }

  // Dummy router object for demonstration purposes.
  const router = {
    push: (route: string) => {
      console.log(`Navigating to: ${route}`)
    },
  }

  return (
    <div>
      <h1>Events View</h1>
      <button onClick={handleNavigateToDocuments}>Go to Documents</button>
    </div>
  )
}

export default EventsView
