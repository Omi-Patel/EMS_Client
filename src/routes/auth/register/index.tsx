"use client";

import type React from "react";

import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ZodError } from "zod";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Github,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { createUser } from "@/lib/action";
import type { UserRegistration, UserResponse } from "@/schema/user-schema";
import { userRegistrationSchema } from "@/schema/user-schema";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/auth/register/")({
  component: RouteComponent,
  loader: async () => {
    const user = getUser();
    if (user?.isAdmin) {
      return redirect({ to: "/app/admin-portal" });
    } else if (user) {
      return redirect({ to: "/" });
    }

    return null;
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState<UserRegistration>({
    name: "",
    email: "",
    phone: "",
    password: "",
    isAdmin: false,
  });

  const registerMutation = useMutation<UserResponse, Error, UserRegistration>({
    mutationFn: createUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast.success("Registration successful!");
      navigate({ to: "/" });
    },
    onError: (error) => {
      if (error.message.includes("400")) {
        toast.error("Invalid registration data");
      } else if (error.message.includes("409")) {
        toast.error("Email already exists");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    },
  });

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema =
        userRegistrationSchema.shape[
          name as keyof typeof userRegistrationSchema.shape
        ];
      fieldSchema.parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldError = error.errors[0]?.message;
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
        return false;
      }
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only validate if the field has a value
    if (value.trim() !== "") {
      validateField(name, value);
    } else {
      // Clear error for empty field
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Calculate password strength when password field changes
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;

    // Contains number or special char
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  const areFieldsFilled = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.password.trim() !== ""
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    try {
      // Validate all fields
      const validatedData = userRegistrationSchema.parse(formData);
      registerMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const fieldName = err.path[0] as string;
          validationErrors[fieldName] = err.message;
        });
        setErrors(validationErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8"
                onClick={() => navigate({ to: "/auth/login" })}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to login</span>
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Create an account
                </CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pr-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      required
                    />
                    {formData.name && !errors.name && (
                      <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                    )}
                    {errors.name && (
                      <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`pr-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      required
                    />
                    {formData.email && !errors.email && (
                      <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                    )}
                    {errors.email && (
                      <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`pr-10 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      required
                    />
                    {formData.phone && !errors.phone && (
                      <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                    )}
                    {errors.phone && (
                      <XCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
                    )}
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}

                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password strength:</span>
                        <span
                          className={
                            passwordStrength > 75
                              ? "text-green-500"
                              : passwordStrength > 50
                                ? "text-yellow-500"
                                : passwordStrength > 25
                                  ? "text-orange-500"
                                  : "text-red-500"
                          }
                        >
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={`h-1 w-full ${getPasswordStrengthColor()}`}
                      />
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending || !areFieldsFilled()}
                >
                  {registerMutation.isPending ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating your account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center justify-center border-t p-6">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-primary"
                onClick={() => navigate({ to: "/auth/login" })}
              >
                Sign in
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
