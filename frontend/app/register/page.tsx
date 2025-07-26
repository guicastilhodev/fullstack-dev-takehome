"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { RegisterRequest } from "@/lib/api/generated-client"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>()

  const password = watch("password")

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    setIsLoading(true)

    try {
      const { confirmPassword, ...registerData } = data
      await registerUser(registerData)

      toast({
        title: "Registration Successful",
        description: "Your account has been created and you are now logged in.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <p className="text-muted-foreground">Sign up for Quote Portal</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  {...register("first_name", {
                    required: "First name is required",
                    maxLength: { value: 30, message: "Maximum 30 characters" },
                  })}
                  placeholder="John"
                />
                {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  {...register("last_name", {
                    required: "Last name is required",
                    maxLength: { value: 30, message: "Maximum 30 characters" },
                  })}
                  placeholder="Doe"
                />
                {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                  maxLength: { value: 150, message: "Maximum 150 characters" },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+$/,
                    message: "Username can only contain letters, numbers, dots, underscores, and hyphens",
                  },
                })}
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                  maxLength: { value: 254, message: "Maximum 254 characters" },
                })}
                placeholder="john.doe@example.com"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
                  },
                })}
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p className="mb-2">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
