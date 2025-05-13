"use client";

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "@/lib/actions";
import { ServiceForm } from "../-components/create-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/app/services/edit/$serviceId")({
  component: RouteComponent,
  loader: async () => {
    const user = getUser();
    if (!user?.isAdmin) {
      return redirect({ to: "/app/services" });
    }
  },
});

function RouteComponent() {
  const { serviceId } = Route.useParams();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceById(serviceId),
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="mb-6">
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  // Error state
  if (error || !response?.data || Array.isArray(response.data)) {
    return (
      <div className="container py-6">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
          <div className="rounded-full bg-red-100 p-3">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-xl font-medium">Service Not Found</h3>
          <p className="mt-2 text-muted-foreground">
            The service you're trying to edit doesn't exist or you don't have
            permission to edit it.
          </p>
          <Button
            variant="outline"
            className="mt-4 gap-2"
            onClick={() => navigate({ to: "/app/services" })}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate({ to: `/app/services/${serviceId}` })}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      <ServiceForm service={response.data} />
    </div>
  );
}
