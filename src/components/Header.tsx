"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { PlusIcon, Edit2Icon } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const isPostPage =
    pathname.startsWith("/blog/") && pathname.split("/").length === 3

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-800 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Conditional Button */}
        <div className="flex items-center ml-4">
           
            <Button variant="outline" className="hidden md:inline-flex">
              <Link
                href="/create-post"
                className="flex items-center space-x-2"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Post</span>
              </Link>
            </Button>
          
        </div>
      </div>
    </header>
  )
}
