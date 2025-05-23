import { Calendar, Home, PersonStanding, School, BookOpenText, Users } from "lucide-react"

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
    url: "/adminstuff",
    icon: Home,
  },
  {
    title: "Teachers",
    url: "/adminstuff/teachers",
    icon: PersonStanding,
  },
  {
    title: "Students",
    url: "/adminstuff/students",
    icon: Users,
  },
  {
    title: "Calendar",
    url: "/adminstuff/calendar",
    icon: Calendar,
  },
  {
    title: "Courses",
    url: "/adminstuff/courses",
    icon: BookOpenText,
  },
  {
    title: "School",
    url: "/adminstuff/schools",
    icon: School,
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
