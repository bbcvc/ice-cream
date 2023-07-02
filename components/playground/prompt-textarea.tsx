"use client"

import * as React from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TemperatureSelectorProps {
  defaultValue?: string
  placeholder?: string
}

export function PromptTextarea({
  defaultValue,
  placeholder = 'Enter your API key...'
}: TemperatureSelectorProps) {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <div className="grid gap-2 pt-2">
      <HoverCard openDelay={200}>
        <div className="grid gap-4">
          <HoverCardTrigger asChild>
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">System Prompt</Label>
            </div>
          </HoverCardTrigger>
          <Textarea
            id="system-prompt"
            placeholder={placeholder}
            value={value}
            className="min-h-[180px]"
            onChange={(e) => setValue(e.target.value)}
            aria-label="system-prompt"
          />
        </div>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          We prioritize your security by ensuring the confidentiality of your API key. Rest assured, it will be stored securely on your local system and will solely be utilized for testing purposes, with no sharing involved.
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

