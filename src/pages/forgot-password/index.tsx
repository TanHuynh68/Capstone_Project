"use client"

import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/atoms/Label"
import { Input } from "@/components/atoms/Input"
import { Button } from "@/components/atoms/Button"

const ForgotPassword = () => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return;
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success
      setEmailSent(true)
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending the reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
            {emailSent
              ? "Check your email for reset instructions"
              : "Enter your email and we'll send you a link to reset your password"}
          </p>
        </div>

        <div className="mt-8 bg-white p-8 shadow sm:rounded-lg">
          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    className={error ? "border-red-500" : ""}
                    placeholder="m@example.com"
                  />
                  {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <p className="text-sm text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                instructions to reset your password.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                }}
              >
                Send to a different email
              </Button>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center">
            <Link to="/login" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

