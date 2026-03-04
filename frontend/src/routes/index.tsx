import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [name, setName] = useState("");

  // Example of using tRPC query with our React Query hook
  const { data, isLoading, error, refetch } = trpc.hello.greeting.useQuery(
    { text: name },
    { enabled: false }, // Only fetch when we trigger it
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto max-w-2xl py-20 px-4">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight text-center">
            Plugy Labs Stack
          </CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Hono, tRPC, Vite React, Tailwind v4, shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-4 mb-8 mt-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </form>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 min-h-[100px] flex items-center justify-center border border-slate-200 dark:border-slate-800">
            {error && (
              <p className="text-destructive font-medium">{error.message}</p>
            )}
            {data && (
              <p className="text-xl font-medium text-primary">
                {data.greeting}
              </p>
            )}
            {!data && !error && !isLoading && (
              <p className="text-muted-foreground text-sm">
                Submit the form to test the tRPC endpoint.
              </p>
            )}
            {isLoading && (
              <p className="text-muted-foreground animate-pulse text-sm">
                Loading response from backend...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        API Route configured at{" "}
        <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">
          /api/v1
        </code>{" "}
        with Rate Limiting enabled.
      </div>
    </div>
  );
}
