import { createFileRoute, redirect } from "@tanstack/react-router";
import { ServiceForm } from "./-components/create-form";
import { getUser } from "@/lib/auth";

export const Route = createFileRoute("/app/services/create")({
  component: RouteComponent,
  loader: async () => {
    const user = getUser();
    if (!user?.isAdmin) {
      return redirect({ to: "/app/services" });
    }
  },
});

function RouteComponent() {
  return (
    <div className="container py-6">
      <ServiceForm service={undefined} />
    </div>
  );
}
