import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarStudent } from "@/components/student-sidebar"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    < >
    <div className="w-full h-screen flex">

        <SidebarProvider>
          <AppSidebarStudent />
          <main className="w-full h-full">
            <SidebarTrigger />
            {children}
          </main>
      </SidebarProvider>
    </div>

    </>

  )
}