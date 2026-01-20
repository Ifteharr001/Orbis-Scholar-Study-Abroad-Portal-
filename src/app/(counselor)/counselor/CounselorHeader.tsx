"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, User, LogOut } from "lucide-react";
import CounselorSidebar from "./CounselorSidebar";

export default function CounselorHeader() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
      
      {/* Left: Mobile Menu Trigger */}
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <CounselorSidebar 
                collapsed={false} 
                setCollapsed={() => {}} 
                isMobile={true}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                user={(session?.user as any) || null} 
            />
          </SheetContent>
        </Sheet>
        
        {/* Title (Optional) */}
        <h1 className="text-lg font-semibold md:hidden">Orbis Scholar</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications (Mock) */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {session?.user?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
                <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Counselor</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/counselor/profile">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}