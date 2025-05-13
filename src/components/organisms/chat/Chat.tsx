"use client"

import type React from "react"

import { useState } from "react"
import { Github, Moon, Phone, Video, Info, PlusCircle, Paperclip, Smile, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  avatar: string
  color: string
  status?: string
}

interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
}

interface Chat {
  id: string
  users: User[]
  messages: Message[]
  lastMessage?: string
  typing?: boolean
}

export function ChatInterface() {
  const [activeChat, setActiveChat] = useState<string>("1")
  const [message, setMessage] = useState("")

  const users: User[] = [
    {
      id: "1",
      name: "Jane Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      color: "bg-orange-500",
      status: "Active 2 mins ago",
    },
    { id: "2", name: "John Doe", avatar: "/placeholder.svg?height=40&width=40", color: "bg-pink-500" },
    { id: "3", name: "Elizabeth Smith", avatar: "/placeholder.svg?height=40&width=40", color: "bg-yellow-500" },
    { id: "4", name: "John Smith", avatar: "/placeholder.svg?height=40&width=40", color: "bg-green-500" },
  ]

  const chats: Chat[] = [
    {
      id: "1",
      users: [users[0], users.find((u) => u.id === "current-user")!],
      messages: [
        { id: "1", content: "That is good to hear!", timestamp: "10:05 AM", senderId: "current-user" },
        { id: "2", content: "How has your day been so far?", timestamp: "10:06 AM", senderId: "1" },
        {
          id: "3",
          content: "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
          timestamp: "10:10 AM",
          senderId: "current-user",
        },
        { id: "4", content: "Awesome! I am just chilling outside.", timestamp: "11:47 AM", senderId: "1" },
      ],
      typing: true,
      lastMessage: "Jane: Typing...",
    },
    {
      id: "2",
      users: [users[1], users.find((u) => u.id === "current-user")!],
      messages: [],
      lastMessage: "You: Let's catch up later",
    },
    {
      id: "3",
      users: [users[2], users.find((u) => u.id === "current-user")!],
      messages: [],
      lastMessage: "Elizabeth: Thanks for the help!",
    },
    {
      id: "4",
      users: [users[3], users.find((u) => u.id === "current-user")!],
      messages: [],
      lastMessage: "John: See you tomorrow",
    },
  ]

  const currentChat = chats.find((chat) => chat.id === activeChat)
  const currentChatUser = currentChat?.users.find((user) => user.id !== "current-user")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // In a real app, you would send this message to your backend
    console.log("Sending message:", message)
    setMessage("")
  }

  return (
    <div className="flex  w-full h-[845px] overflow-hidden rounded-lg border border-gray-800 bg-black text-white">
      {/* Sidebar */}
      <div className="flex w-80 flex-col border-r border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold text-indigo-400">shadcn-chat</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Moon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Chats (4)</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">More options</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <span className="sr-only">New chat</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {chats.map((chat) => {
            const user = chat.users.find((u) => u.id !== "current-user")!
            return (
              <button
                key={chat.id}
                className={cn(
                  "flex w-full items-start gap-3 p-3 text-left hover:bg-gray-900",
                  chat.id === activeChat && "bg-gray-900",
                )}
                onClick={() => setActiveChat(chat.id)}
              >
                <Avatar className={cn("h-10 w-10 border-2", user.color)}>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className={user.color}>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium">{user.name}</div>
                  <p className="truncate text-sm text-gray-400">{chat.lastMessage}</p>
                </div>
              </button>
            )
          })}
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <Avatar className={cn("h-10 w-10 border-2", currentChatUser?.color)}>
              <AvatarImage src={currentChatUser?.avatar || "/placeholder.svg"} alt={currentChatUser?.name} />
              <AvatarFallback className={currentChatUser?.color}>
                {currentChatUser?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{currentChatUser?.name}</div>
              <div className="text-xs text-gray-400">{currentChatUser?.status}</div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {currentChat?.messages.map((msg) => {
              const isCurrentUser = msg.senderId === "current-user"
              const user = isCurrentUser
                ? { name: "You", avatar: "/placeholder.svg?height=40&width=40" }
                : users.find((u) => u.id === msg.senderId)!

              return (
                <div key={msg.id} className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}>
                  {!isCurrentUser && (
                    <Avatar className={cn("mr-2 h-8 w-8 self-end border-2", currentChatUser?.color)}>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className={currentChatUser?.color}>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      isCurrentUser ? "bg-white text-black" : "bg-gray-800",
                    )}
                  >
                    <p>{msg.content}</p>
                    <div className={cn("mt-1 text-right text-xs", isCurrentUser ? "text-gray-600" : "text-gray-400")}>
                      {msg.timestamp}
                    </div>
                  </div>
                  {isCurrentUser && (
                    <Avatar className="ml-2 h-8 w-8 self-end border-2 bg-blue-500">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-blue-500">{user.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-gray-800 p-4">
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            className="flex-1 rounded-full bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-gray-700"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <Smile className="h-5 w-5" />
          </Button>
          <Button type="submit" variant="ghost" size="icon" className="rounded-full" disabled={!message.trim()}>
            <ThumbsUp className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
