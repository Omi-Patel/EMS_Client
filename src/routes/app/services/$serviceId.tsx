"use client";

import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getServiceById, deleteService } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  Edit,
  ImageIcon,
  Loader2,
  Share2,
  Trash2,
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Info,
  ChevronRight,
  IndianRupee,
  BadgeIndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServiceResponse } from "@/schema/service-schema";

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
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Format time
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

// Category colors and icons
const categoryConfig: Record<
  string,
  {
    color: string;
    gradient: string;
    icon: React.ReactNode;
    bgClass: string;
  }
> = {
  venue: {
    color: "text-blue-800",
    gradient: "from-blue-500/60 to-indigo-600/50",
    icon: <MapPin className="h-5 w-5" />,
    bgClass: "bg-blue-50",
  },
  catering: {
    color: "text-amber-800",
    gradient: "from-amber-500/60 to-orange-600/50",
    icon: <IndianRupee className="h-5 w-5" />,
    bgClass: "bg-amber-50",
  },
  photography: {
    color: "text-green-800",
    gradient: "from-green-500/60 to-emerald-600/50",
    icon: <ImageIcon className="h-5 w-5" />,
    bgClass: "bg-green-50",
  },
  entertainment: {
    color: "text-purple-800",
    gradient: "from-purple-500/60 to-fuchsia-600/50",
    icon: <Star className="h-5 w-5" />,
    bgClass: "bg-purple-50",
  },
  decor: {
    color: "text-indigo-800",
    gradient: "from-indigo-500/60 to-violet-600/50",
    icon: <Globe className="h-5 w-5" />,
    bgClass: "bg-indigo-50",
  },
  other: {
    color: "text-gray-800",
    gradient: "from-gray-500/60 to-slate-600/50",
    icon: <Info className="h-5 w-5" />,
    bgClass: "bg-gray-50",
  },
};

export const Route = createFileRoute("/app/services/$serviceId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const user = getUser();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<ServiceResponse>({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceById(serviceId),
  });

  // Check if service is bookmarked
  useEffect(() => {
    const bookmarkedServices = JSON.parse(
      localStorage.getItem("bookmarkedServices") || "[]"
    );
    setIsBookmarked(bookmarkedServices.includes(serviceId));
  }, [serviceId]);

  const toggleBookmark = () => {
    const bookmarkedServices = JSON.parse(
      localStorage.getItem("bookmarkedServices") || "[]"
    );

    if (isBookmarked) {
      const updatedBookmarks = bookmarkedServices.filter(
        (id: string) => id !== serviceId
      );
      localStorage.setItem(
        "bookmarkedServices",
        JSON.stringify(updatedBookmarks)
      );
      setIsBookmarked(false);
      toast.success("Removed from bookmarks", {
        description: "Service has been removed from your bookmarks",
      });
    } else {
      bookmarkedServices.push(serviceId);
      localStorage.setItem(
        "bookmarkedServices",
        JSON.stringify(bookmarkedServices)
      );
      setIsBookmarked(true);
      toast.success("Added to bookmarks", {
        description: "Service has been added to your bookmarks",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteService(serviceId);
      toast.success("Service deleted successfully", {
        description: "The service has been permanently removed.",
      });
      navigate({ to: "/app/services" });
    } catch (error) {
      toast.error("Failed to delete service", {
        description:
          "There was an error deleting this service. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="container space-y-8 py-8">
        <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>

          <div className="relative">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <Skeleton className="h-12 w-32 rounded-full" />
              <Skeleton className="h-12 w-32 rounded-full" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
              <Card className="overflow-hidden border-none shadow-xl">
              <CardHeader>
                  <Skeleton className="h-10 w-2/3 rounded-lg" />
                  <Skeleton className="h-6 w-1/3 rounded-lg" />
              </CardHeader>
                <CardContent className="space-y-6">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-5/6 rounded-lg" />
                  <Skeleton className="h-4 w-4/6 rounded-lg" />
              </CardContent>
            </Card>
          </div>

          <div>
              <Card className="overflow-hidden border-none shadow-xl">
              <CardHeader>
                  <Skeleton className="h-8 w-32 rounded-lg" />
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-full rounded-lg" />
                    <Skeleton className="h-5 w-5/6 rounded-lg" />
                    <Skeleton className="h-5 w-4/6 rounded-lg" />
                  </div>
                <Separator />
                  <div className="flex justify-between">
                    <Skeleton className="h-12 w-24 rounded-full" />
                    <Skeleton className="h-12 w-24 rounded-full" />
                  </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !response?.data || Array.isArray(response.data)) {
    return (
      <div className="bg-gradient-to-b from-red-50 to-white min-h-screen">
        <div className="container py-10">
          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-white p-10 text-center shadow-lg">
            <div className="rounded-full bg-red-100 p-6">
              <X className="h-12 w-12 text-red-600" />
          </div>
            <h3 className="mt-6 text-3xl font-bold text-gray-800">
              Service Not Found
            </h3>
            <p className="mt-4 max-w-md text-lg text-gray-600">
            The service you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button
            variant="outline"
              className="mt-8 gap-2 rounded-full border-red-200 px-6 py-6 text-lg font-medium shadow-sm hover:bg-red-50"
            onClick={() => navigate({ to: "/app/services" })}
          >
              <ArrowLeft className="h-5 w-5" />
            Back to Services
          </Button>
          </div>
        </div>
      </div>
    );
  }

  const service = response.data;
  const categoryStyle =
    categoryConfig[service.category] || categoryConfig.other;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/app/services" })}
            className="group flex items-center gap-2 rounded-full bg-white/70 pl-3 pr-5 shadow-sm backdrop-blur-sm hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="font-medium">Back to Services</span>
          </Button>
        </div>

        {/* Hero Banner */}
        <div className="relative mb-6 sm:mb-10 overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl">
          {/* Hero Image */}
          <div className="relative h-48 sm:h-72 md:h-96 lg:h-[28rem] w-full">
            {service.imageUrl ? (
              <>
                {!imageLoaded && !imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
                    <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-white/60" />
                  </div>
                )}
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className={cn(
                    "h-full w-full object-cover transition-opacity duration-500",
                    imageLoaded && !imageError ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    setImageError(true);
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                      <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-500 font-medium">
                        Image could not be loaded
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                  <p className="mt-2 sm:mt-4 text-sm sm:text-base text-gray-500 font-medium">
                    No image available
                  </p>
                </div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col items-start gap-3 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2 sm:space-y-3">
                <Badge className="mb-2 sm:mb-3 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium uppercase tracking-wider backdrop-blur-md bg-white/20 text-white">
                  {categoryStyle.icon}
                  <span className="ml-2">{service.category}</span>
                </Badge>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-1 sm:mb-2">
                  {service.name}
                </h1>
                <div className="flex items-center text-white/80 text-xs sm:text-sm">
                  <Calendar className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Added on {formatDate(service.createdAt)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                <div className="flex h-10 sm:h-14 items-center rounded-full bg-white/90 px-4 sm:px-6 shadow-lg backdrop-blur-sm">
                  <BadgeIndianRupee className="mr-1.5 h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                  <span className="text-lg sm:text-2xl font-bold text-gray-800">
                    {formatCurrency(service.basePrice)}
                  </span>
                </div>

          <Button
            variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-14 sm:w-14 rounded-full bg-white/90 shadow-lg backdrop-blur-sm border-none hover:bg-white"
                  onClick={toggleBookmark}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                  ) : (
                    <Bookmark className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <Card className="overflow-hidden border-none shadow-xl">
              <CardHeader className="border-b border-gray-100 bg-white pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                    About this service
                  </CardTitle>
                  <Badge
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${categoryStyle.bgClass} ${categoryStyle.color}`}
                  >
                    {categoryStyle.icon}
                    <span className="capitalize">{service.category}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
                <div className="rounded-xl bg-slate-50 p-4 sm:p-6">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Additional quick info cards */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-blue-50 p-3 sm:p-4">
                    <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Last Updated
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(service.updatedAt)} at{" "}
                        {formatTime(service.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 rounded-xl bg-green-50 p-3 sm:p-4">
                    <div className="rounded-full bg-green-100 p-2 sm:p-3">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Created On</h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {formatDate(service.createdAt)} at{" "}
                        {formatTime(service.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white p-4 sm:p-6">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Share this service
                </Button>

                {user?.isAdmin && (
                  <Button
                    className="w-full sm:w-auto gap-2 rounded-full px-5"
                    variant="outline"
                    onClick={() =>
                      navigate({ to: `/app/services/edit/${serviceId}` })
                    }
          >
            <Edit className="h-4 w-4" />
                    Edit Service
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Related information card */}
            <Card className="overflow-hidden border-none shadow-xl">
              <CardHeader className="border-b border-gray-100 bg-white pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                  Related Information
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Contact Support
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Get help with this service
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="rounded-full bg-amber-100 p-2">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Reviews</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          See what others are saying
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>

                  <div className="flex items-center justify-between p-4 sm:p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="rounded-full bg-green-100 p-2">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Visit Website
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Learn more about this service
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing and Actions */}
          <div>
            <Card className="sticky top-6 sm:top-8 overflow-hidden border-none shadow-xl">
              <div
                className={`h-2 w-full bg-gradient-to-r ${categoryStyle.gradient}`}
              />

              <CardHeader className="bg-white pb-4">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                  Service Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 p-4 sm:p-6">
                {/* Price Card */}
                <div className="overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1">
                  <div className="rounded-lg bg-white p-4 sm:p-5">
                    <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
                      Base Price
                    </h3>
                    <div className="flex items-center gap-2">
                      <BadgeIndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {formatCurrency(service.basePrice)}
                      </div>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500">
                      Standard package price for basic services
                    </p>
                  </div>
                </div>

                <Separator className="my-4 sm:my-6" />

                {/* Category and Details */}
                <div className="space-y-4 rounded-xl bg-slate-50 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
                      Category
                    </h3>
                    <Badge
                      className={`capitalize ${categoryStyle.bgClass} ${categoryStyle.color}`}
                    >
                      {service.category}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
                      Created On
                    </h3>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {formatDate(service.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-500">
                      Last Updated
                    </h3>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      {formatDate(service.updatedAt)}
                    </span>
                  </div>
                </div>

                <Separator className="my-4 sm:my-6" />

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    className={cn(
                      "relative w-full gap-2 rounded-xl py-4 sm:py-6 text-base sm:text-lg font-medium shadow-md transition-all hover:shadow-lg",
                      isBookmarked
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-white text-gray-800 hover:bg-gray-100"
                    )}
                    variant={isBookmarked ? "default" : "outline"}
                    onClick={toggleBookmark}
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Saved to Bookmarks</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Save to Bookmarks</span>
                      </>
                    )}
          </Button>

                  {user?.isAdmin && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
                        className="rounded-xl py-4 sm:py-5"
                        onClick={() =>
                          navigate({ to: `/app/services/edit/${serviceId}` })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="rounded-xl py-4 sm:py-5"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
              <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl sm:text-2xl font-bold">
                              Delete this service?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm sm:text-base text-gray-600">
                              This action cannot be undone. This will
                              permanently delete the service "{service.name}"
                              and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="rounded-xl">
                              Cancel
                            </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                              className="gap-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
                  )}
                </div>
            </CardContent>
          </Card>
                  </div>
                </div>

        {/* Mobile action buttons */}
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col gap-2 sm:hidden">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>

          <Button
            variant={isBookmarked ? "default" : "secondary"}
            size="icon"
            className={`h-12 w-12 rounded-full shadow-lg ${
              isBookmarked
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={toggleBookmark}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-5 w-5 text-white" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-800" />
            )}
          </Button>

          {user?.isAdmin && (
                <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
                  onClick={() =>
                    navigate({ to: `/app/services/edit/${serviceId}` })
                  }
                >
              <Edit className="h-5 w-5" />
                </Button>
          )}
        </div>
      </div>
    </div>
  );
}
