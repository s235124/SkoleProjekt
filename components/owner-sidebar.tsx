import { Calendar, Home, PersonStanding, Users, BookOpenText } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/ownerstuff",
    icon: Home,
  },
  {
    title: "Teachers",
    url: "/ownerstuff/teachers",
    icon: PersonStanding,
  },
  {
    title: "Students",
    url: "/ownerstuff/students",
    icon: Users,
  },
  {
    title: "Calendar",
    url: "/ownerstuff/calendar",
    icon: Calendar,
  },
  {
    title: "Courses",
    url: "/ownerstuff/courses",
    icon: BookOpenText,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
