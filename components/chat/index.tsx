'use client'

import { useChat } from 'ai/react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: "-1",
        role: 'assistant',
        content: 'Hello, I am AI.',
      }, {
        id: '0',
        role: 'user',
        content: 'What is your name?',
      }
    ]
  })

  return (
    <div className="mx-auto w-full flex-1 min-h-[677px] flex flex-col stretch space-x-2">
      <div className='flex-1 border rounded-md p-2 mb-2'>
        {messages.map(m => (
          <div key={m.id}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='!m-0 flex w-full items-center space-x-2'>
        <Input type="text" placeholder="message" value={input} onChange={handleInputChange} />
        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
