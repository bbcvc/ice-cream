import { CreditCard, LogOut, PlusCircle, Settings, User, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export function UserNav() {
  const user = useUser()
  const supabaseClient = useSupabaseClient()

  if (!user) {
    return (
      <>null</>
    )
  }

  const { email, user_metadata } = user
  async function signOut(param: { redirect: boolean }) {
    const { error } = await supabaseClient.auth.signOut()
    error && console.error('=======sign out error=====', { error })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex">
          <Button variant="ghost" className="relative h-6 w-6 rounded-full mr-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user_metadata.avatar_url || `https://avatars.dicebear.com/api/micah/${email}.svg`} alt={`@${user_metadata.full_name}`} />
              <AvatarFallback>{user_metadata.name}</AvatarFallback>
            </Avatar>
          </Button>
          <ChevronDown width={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user_metadata.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ redirect: false })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
