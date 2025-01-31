import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useToast } from "@/components/ui/use-toast";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Chronicles from "./pages/Chronicles";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Error getting session:", error);
        toast({
          variant: "destructive",
          title: "Ошибка аутентификации",
          description: "Пожалуйста, войдите снова",
        });
        setSession(null);
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        toast({
          variant: "destructive",
          title: "Сессия завершена",
          description: "Пожалуйста, войдите снова",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <BrowserRouter>
          <TooltipProvider>
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                {session && <AppSidebar />}
                <main className="flex-1">
                  {session && <SidebarTrigger className="m-4" />}
                  <Routes>
                    <Route
                      path="/"
                      element={
                        session ? (
                          <Index session={session} />
                        ) : (
                          <Navigate to="/auth" replace />
                        )
                      }
                    />
                    <Route
                      path="/auth"
                      element={
                        !session ? <Auth /> : <Navigate to="/" replace />
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        session ? (
                          <Profile session={session} />
                        ) : (
                          <Navigate to="/auth" replace />
                        )
                      }
                    />
                    <Route
                      path="/favorites"
                      element={
                        session ? (
                          <Favorites session={session} />
                        ) : (
                          <Navigate to="/auth" replace />
                        )
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        session ? (
                          <Settings session={session} />
                        ) : (
                          <Navigate to="/auth" replace />
                        )
                      }
                    />
                    <Route
                      path="/chronicles"
                      element={
                        session ? (
                          <Chronicles />
                        ) : (
                          <Navigate to="/auth" replace />
                        )
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;