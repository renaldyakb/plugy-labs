import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Server,
  Zap,
  CheckCircle2,
  XCircle,
  Send,
  Globe,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [name, setName] = useState("");

  // tRPC query for greeting
  const { data, isLoading, error, refetch } = trpc.hello.greeting.useQuery(
    { text: name },
    { enabled: false },
  );

  // tRPC query for server health (polls every 5 seconds)
  const { data: healthData, isError: isHealthError } =
    trpc.hello.health.useQuery(undefined, { refetchInterval: 5000 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  return (
    <div className="container mx-auto max-w-2xl py-20 px-4 min-h-screen flex flex-col justify-center">
      {/* Health Status Bar */}
      <div className="flex items-center justify-end mb-4 gap-2 text-sm font-medium">
        <Server className="w-4 h-4 text-slate-500" />
        <span className="text-slate-600 dark:text-slate-400">
          System Status:
        </span>
        {healthData && !isHealthError ? (
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All Systems Operational kakrey
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-1 rounded-full border border-rose-200 dark:border-rose-800 shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            Disconnected
          </span>
        )}
      </div>

      <Card className="shadow-2xl border-t-4 border-t-indigo-500 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <CardHeader className="pb-6">
          <CardTitle className="text-4xl font-extrabold tracking-tight text-center bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent flex justify-center items-center gap-3">
            <Zap className="w-8 h-8 text-indigo-500" />
            Plugy Labs Stack
          </CardTitle>
          <CardDescription className="text-center text-lg mt-3 flex items-center justify-center gap-2">
            Hono <span className="text-slate-300 mx-1">•</span>
            tRPC <span className="text-slate-300 mx-1">•</span>
            Vite React <span className="text-slate-300 mx-1">•</span>
            Tailwind v4
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="relative flex-1 group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="pl-9 h-12 text-md transition-all border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </form>

          {/* Response Display Area */}
          <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 min-h-[120px] shadow-inner flex items-center justify-center transition-all">
            {error && (
              <div className="flex flex-col items-center text-destructive animate-in slide-in-from-bottom-2 fade-in duration-300">
                <XCircle className="w-8 h-8 mb-2 opacity-80" />
                <p className="font-medium text-center">{error.message}</p>
              </div>
            )}

            {data && !error && (
              <div className="flex flex-col items-center text-indigo-600 dark:text-indigo-400 animate-in zoom-in-95 fade-in duration-300">
                <CheckCircle2 className="w-10 h-10 mb-3 text-emerald-500 drop-shadow-sm" />
                <p className="text-2xl font-bold text-center drop-shadow-sm">
                  {data.greeting}
                </p>
              </div>
            )}

            {!data && !error && !isLoading && (
              <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center gap-2 select-none">
                <ShieldCheck className="w-4 h-4" />
                Awaiting your command
              </p>
            )}

            {isLoading && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse font-medium">
                  Connecting to tRPC backend...
                </p>
              </div>
            )}

            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </CardContent>

        <CardFooter className="justify-between border-t border-slate-100 dark:border-slate-800/60 pt-4 pb-4 px-6 text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Rate Limiter:
            </span>
            Active (10 req/IP)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" /> API Prefix:
            </span>
            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-400">
              /api/v1
            </code>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
