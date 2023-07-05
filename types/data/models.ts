export const types = ["GPT-4", "GPT-3.5"] as const

export type ModelType = (typeof types)[number]

export interface Model<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const models: Model<ModelType>[] = [
  {
    id: "464a47c3-7ab5-44d7-b669-f9cb5a9e8465",
    name: "gpt-3.5-turbo",
    description: "A set of models that improve on GPT-3.5 and can understand as well as generate natural language or code.",
    type: "GPT-3.5",
  },
  {
    id: "c305f976-8e38-42b1-9fb7-d21b2e34f0da",
    name: "gpt-4",
    description:
      "Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.",
    type: "GPT-4",
  },
]
