import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoldRateProvider } from "@/contexts/GoldRateContext";
import { CartProvider } from "@/contexts/CartContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminCreatorReels from "./pages/admin/AdminCreatorReels";
import AdminSettings from "./pages/admin/AdminSettings";
import Login from "./pages/Login";
import "@/index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GoldRateProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <HashRouter>
                <Routes>
                  <Route path="/" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="banners" element={<AdminBanners />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="videos" element={<AdminVideos />} />
                    <Route path="creator-reels" element={<AdminCreatorReels />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                  </Route>
                </Routes>
              </HashRouter>
            </CartProvider>
          </AuthProvider>
        </GoldRateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
