import { createFileRoute } from "@tanstack/react-router";
import { ListServices } from "@/routes/app/services/-components/ListServices";

export const Route = createFileRoute("/app/services/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Our Services</h1>
      <ListServices />
    </div>
  );
}
