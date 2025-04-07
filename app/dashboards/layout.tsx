'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/owner-sidebar"
import { AppSidebarStudent } from "@/components/student-sidebar"
import LogoutButton from "@/components/logout-button"
import { useSelectedLayoutSegment } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();

  const getSidebar = () => {
    switch(segment) {
      case "student":
        return <AppSidebarStudent />
      case "instructor":
        return <AppSidebar />
      case "owner":
        return <AppSidebar />
    }
  }
  return (
    < >
    <div className="w-full h-screen flex">
        <SidebarProvider>
          {getSidebar()}
          <main className="w-full h-full">
            <SidebarTrigger />
            {children}
          </main>
      </SidebarProvider>
      <LogoutButton></LogoutButton>
    </div>

    </>

  )
}