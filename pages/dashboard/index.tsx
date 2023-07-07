import {
  Plus
} from "lucide-react"
import Header from '@/components/home/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useUser } from '@supabase/auth-helpers-react'
import { Metadata } from 'next'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePresetStore } from "@/store/preset.store"
import { NewProject } from "@/components/dashboard/new-project"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
}

export default function DashboardPage() {
  const user = useUser()
  const { email, user_metadata } = user || {}

  const { presetList } = usePresetStore()

  if (!user) {
    return (
      <>loading</>
    )
  }

  return (
    <div className='flex flex-col'>
      <Header />
      <div className="flex-1 space-y-4 p-10 pt-48 max-w-[1160px] w-full m-auto">
        <div className="flex items-center justify-between mb-8">
          <div className='flex items-center justify-start space-x-4'>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user_metadata?.avatar_url || `https://avatars.dicebear.com/api/micah/${email}.svg`} alt={`@${user_metadata?.full_name || ''}`} />
              <AvatarFallback>{user_metadata?.name}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold tracking-tight">
              Dashboard
            </h2>
          </div>
          <div className="flex items-center">
            <NewProject />
          </div>
        </div>
        <div className="flex flex-wrap space-y-4 space-x-4">
          {
            presetList.map((preset) => (
              <Card className="w-[30%]" key={preset.id}>
                <CardHeader>
                  <CardTitle>{preset.name}</CardTitle>
                  <CardDescription>{preset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/playground/${preset.id}`}>--</Link>
                </CardFooter>
              </Card>
            ))
          }
        </div>
      </div>
    </div>
  )
}
