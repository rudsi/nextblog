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
import { PlusIcon} from "lucide-react"

export default function Header() {

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button variant="outline" className="hidden md:inline-flex">
          <Link
            href="/create-post"
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Post</span>
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          asChild
        >
          <Link href="/create-post">
            <PlusIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}