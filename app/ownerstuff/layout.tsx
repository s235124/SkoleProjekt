import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/owner-sidebar"
import LogoutButton from "@/components/logout-button"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    < >
    <div className="w-full h-screen flex">

        <SidebarProvider>
          <AppSidebar />
          <main className="w-full h-full">
            <SidebarTrigger />
            {children}
          </main>
          <LogoutButton></LogoutButton>
      </SidebarProvider>
    </div>

    </>

  )
}