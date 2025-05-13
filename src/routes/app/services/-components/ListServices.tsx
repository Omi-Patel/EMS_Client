"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServices } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Calendar,
  Eye,
  Filter,
  ImageIcon,
  Search,
  SlidersHorizontal,
  X,
  PlusCircle,
  Sparkles,
  Camera,
  Music,
  Utensils,
  Building,
  Palette,
  Package,
  BadgeIndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceData, ListServiceResponse } from "@/schema/service-schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Category icons mapping with more specific icons
const categoryIcons: Record<string, React.ReactNode> = {
  venue: <Building className="h-4 w-4" />,
  catering: <Utensils className="h-4 w-4" />,
  photography: <Camera className="h-4 w-4" />,
  entertainment: <Music className="h-4 w-4" />,
  decor: <Palette className="h-4 w-4" />,
  other: <Package className="h-4 w-4" />,
};

// Category colors
const categoryColors: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  venue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  catering: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  photography: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
  },
  entertainment: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  decor: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  other: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  },
};

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export function ListServices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeView, setActiveView] = useState<string>("grid");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery<ListServiceResponse>({
    queryKey: ["services"],
    queryFn: getServices,
  });

  // Filter and sort services
  const filteredServices = response?.data
    ? response.data
        .filter((service) => {
          const matchesSearch =
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase());

          const matchesCategory =
            categoryFilter === "all" || service.category === categoryFilter;

          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          if (sortBy === "newest") {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else if (sortBy === "oldest") {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          } else if (sortBy === "price-high") {
            return b.basePrice - a.basePrice;
          } else if (sortBy === "price-low") {
            return a.basePrice - b.basePrice;
          } else if (sortBy === "name-asc") {
            return a.name.localeCompare(b.name);
          } else if (sortBy === "name-desc") {
            return b.name.localeCompare(a.name);
          }
          return 0;
        })
    : [];

  // Render loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-1 h-4 w-72" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card
                key={i}
                className="overflow-hidden border-border/40 shadow-sm transition-all"
              >
                <div className="relative">
                  <Skeleton className="aspect-video w-full" />
                </div>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-5/6" />
                </CardContent>
                <CardFooter className="pt-0">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50/50 p-8 text-center">
        <div className="rounded-full bg-red-100 p-3">
          <X className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Failed to load services</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          There was an error loading your services. Please try again later.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-red-200 bg-white hover:bg-red-50"
          onClick={() => refetch()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Render empty state
  if (!response?.data || response.data.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-medium">No services available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't created any services yet. Get started by creating your
          first service.
        </p>
        <Button
          className="mt-4 gap-2"
          onClick={() => navigate({ to: "/app/services/create" })}
        >
          <PlusCircle className="h-4 w-4" />
          Create Service
        </Button>
      </div>
    );
  }

  // Render empty search results
  if (
    filteredServices.length === 0 &&
    (searchTerm || categoryFilter !== "all")
  ) {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground">
              Manage your service offerings
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div
              className={cn(
                "relative w-full transition-all duration-200 sm:w-auto",
                isSearchFocused ? "sm:w-[300px]" : "sm:w-[200px]"
              )}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="w-full pl-9 pr-8 focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchTerm && (
                <button
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Category</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(categoryIcons).map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      {categoryIcons[category]}
                      <span className="capitalize">{category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Sort by</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-amber-200 bg-amber-50/50 p-8 text-center">
          <div className="rounded-full bg-amber-100 p-3">
            <Search className="h-6 w-6 text-amber-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium">
            No matching services found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <div className="mt-4 flex gap-2">
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200 bg-white hover:bg-amber-50"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            )}
            {categoryFilter !== "all" && (
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200 bg-white hover:bg-amber-50"
                onClick={() => setCategoryFilter("all")}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render services list
  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            {filteredServices.length}{" "}
            {filteredServices.length === 1 ? "service" : "services"} available
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="mb-6 rounded-xl bg-muted/30 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className={cn(
              "relative w-full transition-all duration-200 sm:w-auto",
              isSearchFocused ? "sm:w-[300px]" : "sm:w-[200px]"
            )}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              className="w-full border-muted-foreground/20 bg-white pl-9 pr-8 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchTerm && (
              <button
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full border-muted-foreground/20 bg-white sm:w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Category</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.keys(categoryIcons).map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      {categoryIcons[category]}
                      <span className="capitalize">{category}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full border-muted-foreground/20 bg-white sm:w-[180px]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Sort by</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={activeView}
              onValueChange={setActiveView}
              className="hidden sm:block"
            >
              <TabsList className="bg-white">
                <TabsTrigger
                  value="grid"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Services grid/list view */}
      <Tabs value={activeView} className="w-full">
        <TabsContent value="grid" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service: ServiceData) => (
              <div key={service._id}>
                <Card className="group h-full overflow-hidden border-border/40 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-primary/5">
                  <div className="relative">
                    {service.imageUrl ? (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={service.imageUrl || "/placeholder.svg"}
                          alt={service.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                            target.onerror = null; // Prevent infinite loop
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-muted/50">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute right-3 top-3">
                      <Badge
                        className={cn(
                          "capitalize shadow-sm",
                          categoryColors[service.category]?.bg || "bg-slate-50",
                          categoryColors[service.category]?.text ||
                            "text-slate-700",
                          "border",
                          categoryColors[service.category]?.border ||
                            "border-slate-200"
                        )}
                      >
                        <span className="flex items-center gap-1">
                          {categoryIcons[service.category]}
                          {service.category}
                        </span>
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <p className="line-clamp-2 text-sm font-medium">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">
                      {service.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 font-medium text-primary">
                      <BadgeIndianRupee className="h-3.5 w-3.5" />
                      {formatCurrency(service.basePrice)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(service.createdAt)}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      variant="outline"
                      className="w-full gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                      onClick={() =>
                        navigate({ to: `/app/services/${service._id}` })
                      }
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="space-y-4">
            {filteredServices.map((service: ServiceData) => (
              <div key={service._id}>
                <Card className="group overflow-hidden border-border/40 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-primary/5">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative sm:w-1/4">
                      {service.imageUrl ? (
                        <div className="aspect-video h-full w-full overflow-hidden bg-muted sm:aspect-square">
                          <img
                            src={service.imageUrl || "/placeholder.svg"}
                            alt={service.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                              target.onerror = null; // Prevent infinite loop
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex aspect-video h-full w-full items-center justify-center bg-muted/50 sm:aspect-square">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute right-3 top-3">
                        <Badge
                          className={cn(
                            "capitalize shadow-sm",
                            categoryColors[service.category]?.bg ||
                              "bg-slate-50",
                            categoryColors[service.category]?.text ||
                              "text-slate-700",
                            "border",
                            categoryColors[service.category]?.border ||
                              "border-slate-200"
                          )}
                        >
                          <span className="flex items-center gap-1">
                            {categoryIcons[service.category]}
                            {service.category}
                          </span>
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-xl font-semibold">
                            {service.name}
                          </h3>
                          <span className="flex items-center gap-1 font-medium text-primary">
                            {formatCurrency(service.basePrice)}
                          </span>
                        </div>
                        <p className="mb-4 text-muted-foreground">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(service.createdAt)}</span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 transition-colors hover:bg-primary hover:text-primary-foreground"
                          onClick={() =>
                            navigate({ to: `/app/services/${service._id}` })
                          }
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
