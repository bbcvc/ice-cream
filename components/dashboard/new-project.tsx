import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePresetStore } from "@/store/preset.store"
import { nanoid } from "nanoid"
import { useState } from "react"
import { Plus } from "lucide-react"

export function NewProject() {
  const [presetName, setPresetName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const { add } = usePresetStore()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-5 h-5" /> <div>new Project</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>new Project</DialogTitle>
          <DialogDescription>
            This will save the current playground state as a preset which you
            can access later or share with others.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" autoFocus value={presetName} onChange={(e) => setPresetName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogPrimitive.Close asChild>
            <Button type="submit" onClick={() => {
              add({ name: presetName, description: description, id: nanoid() })
              setPresetName('')
              setDescription('')
            }}>Save</Button>
          </DialogPrimitive.Close>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
