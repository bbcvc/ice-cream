import { Metadata } from "next"
import { History } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

import { CodeViewer } from "@/components/playground/code-viewer"
import { Icons } from "@/components/playground/icons"
import { MaxLengthSelector } from "@/components/playground/maxlength-selector"
import { ModelSelector } from "@/components/playground/model-selector"
import { PresetActions } from "@/components/playground/preset-actions"
import { PresetSave } from "@/components/playground/preset-save"
import { PresetSelector } from "@/components/playground/preset-selector"
import { PresetShare } from "@/components/playground/preset-share"
import { TemperatureSelector } from "@/components/playground/temperature-selector"
import { TopPSelector } from "@/components/playground/top-p-selector"
import { models, types } from "../../lib/data/models"
import { presets } from "../../lib/data/presets"
import Editor from "@/components/editor"
import { useEffect } from "react"

export const metadata: Metadata = {
  title: "Playground",
  description: "The OpenAI Playground built using the components.",
}

export default function PlaygroundPage() {
  useEffect(() => {
    fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt: 'my name is eric.'
      })
    })
  }, [])


  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg font-semibold">Playground</h2>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className="hidden space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="complete" className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                <div className="grid gap-2">
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Mode
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[320px] text-sm" side="left">
                      Choose the interface that best suits your task. You can
                      provide: a simple prompt to complete, starting and ending
                      text to insert a completion within, or some text with
                      instructions to edit it.
                    </HoverCardContent>
                  </HoverCard>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="complete">
                      <span className="sr-only">Complete</span>
                      <Icons.completeMode className="h-5 w-5" />
                    </TabsTrigger>
                    <TabsTrigger value="insert">
                      <span className="sr-only">Insert</span>
                      <Icons.insertMode className="h-5 w-5" />
                    </TabsTrigger>
                    <TabsTrigger value="edit">
                      <span className="sr-only">Edit</span>
                      <Icons.editMode className="h-5 w-5" />
                    </TabsTrigger>
                  </TabsList>
                </div>
                <ModelSelector types={types} models={models} />
                <TemperatureSelector defaultValue={[0.56]} />
                <MaxLengthSelector defaultValue={[256]} />
                <TopPSelector defaultValue={[0.9]} />
              </div>
              <div className="md:order-1">
                <TabsContent value="complete" className="mt-0 border-0 p-0">
                  <div className="flex h-full flex-col space-y-4">
                    <Editor />
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="insert" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full gap-6 lg:grid-cols-2">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="input">Input</Label>
                        <Textarea
                          id="input"
                          placeholder="We're writing to [inset]. Congrats from OpenAI!"
                          className="flex-1 lg:min-h-[677px]"
                        />
                      </div>
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label>Output</Label>
                        <div className="rounded-md border bg-muted flex-1 lg:min-h-[677px]"></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="edit" className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="h-full gap-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-1 flex-col space-y-2">
                          <div
                            placeholder="We is going to the market."
                            className="rounded-md border flex-1 lg:min-h-[600px] p-6 text-slate-400"
                          >Chat View</div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="instructions">Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Fix the grammar."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button>Submit</Button>
                      <Button variant="secondary">
                        <span className="sr-only">Show history</span>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  )
}
