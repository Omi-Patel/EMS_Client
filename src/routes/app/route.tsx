import Header from "@/components/Landing-Page/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-6 md:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
