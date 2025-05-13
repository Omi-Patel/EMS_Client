"use client";

import type React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceSchema,
  type ServiceRegistration,
  serviceCategoryEnum,
  type ServiceData,
} from "@/schema/service-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createService, updateService } from "@/lib/actions";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  FileText,
  ImageIcon,
  Loader2,
  Tag,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  cleaning: <ImageIcon className="h-4 w-4" />,
  repair: <ImageIcon className="h-4 w-4" />,
  installation: <ImageIcon className="h-4 w-4" />,
  maintenance: <ImageIcon className="h-4 w-4" />,
  consultation: <ImageIcon className="h-4 w-4" />,
  other: <ImageIcon className="h-4 w-4" />,
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
};

interface ServiceFormProps {
  service?: ServiceData;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(service?.imageUrl || "");
  const [formProgress, setFormProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const form = useForm<ServiceRegistration>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || "",
      description: service?.description || "",
      basePrice: service?.basePrice || 0,
      category: service?.category || "other",
      imageUrl: service?.imageUrl || "",
    },
    mode: "onChange",
  });

  // Calculate form completion progress
  useEffect(() => {
    const formValues = form.getValues();
    const requiredFields = ["name", "description", "basePrice", "category"];
    const filledFields = requiredFields.filter(
      (field) => formValues[field as keyof ServiceRegistration]
    ).length;

    setFormProgress((filledFields / requiredFields.length) * 100);
  }, [form.watch()]);

  // Update image preview when image URL changes
  useEffect(() => {
    const imageUrl = form.watch("imageUrl");
    if (imageUrl && imageUrl.trim() !== "") {
      setImagePreview(imageUrl);
    } else {
      setImagePreview("");
    }
  }, [form.watch("imageUrl")]);

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      toast.success("Service created successfully", {
        description: `${form.getValues().name} has been added to your services.`,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      form.reset();
      setImagePreview("");
    },
    onError: () => {
      toast.error("Failed to create service", {
        description: "There was an error creating your service. Please try again.",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceRegistration }) =>
      updateService(id, data),
    onSuccess: () => {
      toast.success("Service updated successfully", {
        description: `${form.getValues().name} has been updated.`,
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
      queryClient.invalidateQueries({ queryKey: ["services", service?._id] });
    },
    onError: () => {
      toast.error("Failed to update service", {
        description: "There was an error updating your service. Please try again.",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File too large", {
          description: "Please select an image smaller than 5MB",
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        form.setValue("imageUrl", base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: ServiceRegistration) {
    if (service) {
      updateMutation.mutate({ id: service._id, data });
    } else {
      createMutation.mutate(data);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/40 shadow-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {service ? "Update Service" : "Create New Service"}
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {formProgress.toFixed(0)}% Complete
            </Badge>
          </div>
          <CardDescription>
            {service
              ? "Update the details of your existing service"
              : "Fill in the details below to create a new service offering"}
          </CardDescription>
          <Separator />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Service Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter service name"
                        {...field}
                        className="transition-all focus-within:ring-2 focus-within:ring-primary/20"
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise name for your service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter service description"
                        {...field}
                        className="min-h-[120px] resize-none transition-all focus-within:ring-2 focus-within:ring-primary/20"
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed explanation of what this service includes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        Base Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            className="pl-9 transition-all focus-within:ring-2 focus-within:ring-primary/20"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Starting price for this service
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceCategoryEnum.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                {categoryIcons[category]}
                                <span className="capitalize">{category}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Group similar services together
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      Image
                    </FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter image URL"
                            {...field}
                            className="transition-all focus-within:ring-2 focus-within:ring-primary/20"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="whitespace-nowrap"
                          >
                            Upload Image
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload an image or provide an image URL
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          form.reset();
                          setImagePreview(service?.imageUrl || "");
                        }}
                      >
                        Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset form to {service ? "original values" : "empty"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  type="submit"
                  disabled={isSubmitting || formProgress < 75}
                  className="min-w-[120px] gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {service ? "Updating..." : "Creating..."}
                    </>
                  ) : service ? (
                    "Update Service"
                  ) : (
                    "Create Service"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preview Card */}
      <Card className="border-border/40 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Service Preview</CardTitle>
          <CardDescription>
            This is how your service will appear to customers
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/30">
            {imagePreview ? (
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Service preview"
                className="h-full w-full object-cover"
                onError={() =>
                  setImagePreview("/placeholder.svg?height=300&width=500")
                }
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/30">
                <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3
                className={cn(
                  "text-xl font-semibold",
                  !form.watch("name") && "text-muted-foreground/50"
                )}
              >
                {form.watch("name") || "Service Name"}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {form.watch("category") || "category"}
                </Badge>
                <Badge variant="secondary" className="font-medium">
                  {form.watch("basePrice")
                    ? formatCurrency(form.watch("basePrice"))
                    : "₹0.00"}
                </Badge>
              </div>
            </div>

            <p
              className={cn(
                "text-sm text-muted-foreground",
                !form.watch("description") && "text-muted-foreground/50"
              )}
            >
              {form.watch("description") ||
                "Your service description will appear here. Make sure to provide a detailed explanation of what this service includes, its benefits, and any other relevant information that might help customers understand what you're offering."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
