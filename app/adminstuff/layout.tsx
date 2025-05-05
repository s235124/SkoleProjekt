"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin-sidebar"
import LogoutButton from "@/components/logout-button"
import { SelectedSchoolProvider } from './selectedSchoolContext';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <SelectedSchoolProvider>
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
    </SelectedSchoolProvider>


  )
}