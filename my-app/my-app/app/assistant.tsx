"use client";

import React from "react";
import { motion } from "framer-motion";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import { Loader2, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// -----------------------
// Reusable Header
// -----------------------
const AssistantHeader = ({ onCloseSidebar }: { onCloseSidebar?: () => void }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <SidebarTrigger aria-label="Toggle sidebar" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-lg font-semibold text-gray-800">
                Starter Template
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Close Button on Mobile */}
      {onCloseSidebar && (
        <button
          onClick={onCloseSidebar}
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      )}
    </header>
  );
};

// -----------------------
// Main Assistant Component
// -----------------------
export const Assistant = () => {
  const runtime = useChatRuntime();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (runtime) {
      const timer = setTimeout(() => setLoading(false), 800); // simulate loading delay
      return () => clearTimeout(timer);
    }
  }, [runtime]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-center p-4">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full bg-gray-50 relative overflow-hidden">
          {/* Sidebar - mobile version slides in */}
          {isMobile ? (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: sidebarOpen ? 0 : "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg lg:hidden"
            >
              <AppSidebar />
            </motion.div>
          ) : (
            <div className="hidden lg:block shadow-md">
              <AppSidebar />
            </div>
          )}

          {/* Main Content */}
          <SidebarInset className="flex flex-col w-full relative">
            <AssistantHeader onCloseSidebar={() => setSidebarOpen(false)} />

            <div className="flex-1 overflow-y-auto relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="h-full p-safe"
                >
                  <Thread />
                </motion.div>
              )}
            </div>
          </SidebarInset>

          {/* Background Overlay when sidebar is open on mobile */}
          {isMobile && sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
