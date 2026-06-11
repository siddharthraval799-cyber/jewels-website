import { Capacitor } from "@capacitor/core";

// ─── Centralized API Client ────────────────────────────────
const IS_STATIC_HOST =
  typeof window !== "undefined" && 
  (window.location.hostname.endsWith("github.io") || 
   window.location.hostname.includes("stackblitz") || 
   window.location.hostname.includes("netlify"));

// On Mobile (Capacitor), we must use the full URL of the server.
// On Web, we can use relative /api which is proxied or served by the same host.
const API_BASE = Capacitor.isNativePlatform()
  ? "http://10.164.67.138:3001/api"
  : "/api";

function getToken(): string | null {
  return localStorage.getItem("aurum_token");
}

export function setToken(token: string) {
  localStorage.setItem("aurum_token", token);
}

export function clearToken() {
  localStorage.removeItem("aurum_token");
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Set json content type by default unless body is FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  } else if (!options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const tryMock = async () => {
    try {
      let cleanEndpoint = endpoint.split('?')[0];

      // Mapping Admin routes to common mock files if specific one doesn't exist
      if (cleanEndpoint.startsWith("/admin/")) {
         if (cleanEndpoint === "/admin/products") cleanEndpoint = "/products";
         if (cleanEndpoint === "/admin/categories") cleanEndpoint = "/categories";
         if (cleanEndpoint === "/admin/creator-reels") cleanEndpoint = "/creator-reels";
         if (cleanEndpoint === "/admin/reviews") cleanEndpoint = "/testimonials"; // reviews list is actually different but we can fall back
         if (cleanEndpoint === "/admin/dashboard") {
            return {
               stats: { totalProducts: 124, totalOrders: 42, totalCustomers: 18, totalRevenue: 125000, pendingOrders: 5, unreadMessages: 3 },
               recentOrders: []
            };
         }
      }

      const baseUrl = import.meta.env.BASE_URL || "/";
      const mockRes = await fetch(`${baseUrl}mock${cleanEndpoint}.json`);
      if (mockRes.ok) {
         let data = await mockRes.json();
         // Recursively prepend baseUrl to any string starting with /uploads/
         const fixUrls = (obj: any): any => {
            if (typeof obj === "string") {
               if (obj.startsWith("/uploads/")) {
                  // Ensure we don't double up on slashes if baseUrl ends with one or obj starts with one
                  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                  return `${base}${obj}`;
               }
               return obj;
            }
            if (Array.isArray(obj)) return obj.map(fixUrls);
            if (obj && typeof obj === "object") {
               const newObj: any = {};
               for (const key in obj) newObj[key] = fixUrls(obj[key]);
               return newObj;
            }
            return obj;
         };
         return fixUrls(data);
      }
    } catch (e) {}
    return null;
  };

  // If on a static host and it's a POST/PUT/DELETE, return a mock success
  if (IS_STATIC_HOST && options.method && options.method !== "GET") {
     console.log(`[Static Mode] Mocking ${options.method} request to ${endpoint}`);
     
     // Mock Auth Success
     if (endpoint.includes("/auth/login") || endpoint.includes("/auth/whatsapp-otp/verify") || endpoint.includes("/auth/register")) {
        return { 
          user: { id: "mock-user", name: "Demo User", email: "demo@example.com", phone: "1234567890", role: "admin" },
          token: "mock-token-" + Date.now()
        } as unknown as T;
     }
     
     if (endpoint.includes("/auth/whatsapp-otp/send")) {
        return { success: true, message: "OTP Sent (Demo Mode)" } as unknown as T;
     }

     if (endpoint.includes("/orders")) {
        return { id: "mock-order-id", orderNumber: "AU" + Date.now().toString().slice(-6) } as unknown as T;
     }

     return { success: true } as unknown as T;
  }

  // If on static host and it's a GET, try mock first to avoid 404/405
  if (IS_STATIC_HOST && (!options.method || options.method === "GET")) {
    const mockData = await tryMock();
    if (mockData) return mockData;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const mockData = await tryMock();
      if (mockData) return mockData;
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `API Error ${res.status}`);
    }

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      const mockData = await tryMock();
      if (mockData) return mockData;
      throw new Error(`Invalid JSON response`);
    }
  } catch (err: any) {
    // If fetch fails entirely (e.g. server down), try mock as last resort
    const mockData = await tryMock();
    if (mockData) return mockData;
    throw err;
  }
}

// ─── Auth ──────────────────────────────────────────────────
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: User; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { name: string; email: string; password: string; phone?: string }) =>
      request<{ user: User; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    sendWhatsappOtp: (phone: string) =>
      request<{ success: boolean; message: string }>("/auth/whatsapp-otp/send", {
        method: "POST",
        body: JSON.stringify({ phone }),
      }),
    verifyWhatsappOtp: (phone: string, otp: string) =>
      request<{ user: User; token: string }>("/auth/whatsapp-otp/verify", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
      }),
    me: () => request<{ user: User }>("/auth/me"),
    updateProfile: (data: Partial<User>) =>
      request<{ user: User }>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ─── Products ────────────────────────────────────────────
  products: {
    list: (params?: Record<string, string>) => {
      const q = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{ products: Product[]; total: number }>(`/products${q}`);
    },
    get: (id: string) => request<{ product: Product }>(`/products/${id}`),
    create: (data: Partial<Product>) =>
      request("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Product>) =>
      request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/products/${id}`, { method: "DELETE" }),
    search: (q: string) => request<{ products: Product[] }>(`/search?q=${encodeURIComponent(q)}`),
  },

  // ─── Categories ──────────────────────────────────────────
  categories: {
    list: () => request<{ categories: Category[] }>("/categories"),
    create: (data: Partial<Category>) =>
      request("/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Category>) =>
      request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/categories/${id}`, { method: "DELETE" }),
  },

  // ─── Orders ──────────────────────────────────────────────
  orders: {
    create: (data: OrderCreateData) =>
      request<{ id: string; orderNumber: string }>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    list: () => request<{ orders: Order[] }>("/orders"),
    get: (id: string) => request<{ order: Order }>(`/orders/${id}`),
  },

  // ─── Wishlist ────────────────────────────────────────────
  wishlist: {
    list: () => request<{ wishlist: WishlistItem[] }>("/wishlist"),
    add: (productId: string) =>
      request("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
    remove: (productId: string) =>
      request(`/wishlist/${productId}`, { method: "DELETE" }),
  },

  // ─── Contact ─────────────────────────────────────────────
  contact: {
    send: (data: { name: string; email?: string; phone?: string; subject?: string; message: string }) =>
      request("/contact", { method: "POST", body: JSON.stringify(data) }),
  },

  // ─── Testimonials & Reviews ──────────────────────────────
  testimonials: {
    get: () => request<{ reviews: Review[]; videos: FeedbackVideo[] }>("/testimonials"),
    submitReview: (data: { rating: number; text: string }) =>
      request("/reviews", { method: "POST", body: JSON.stringify(data) }),
  },

  // ─── Creator Reels ───────────────────────────────────────
  creatorReels: {
    get: () => request<{ reels: CreatorReel[] }>("/creator-reels"),
  },

  // ─── Gallery ─────────────────────────────────────────────
  gallery: {
    get: () => request<{ photos: GalleryPhoto[] }>("/gallery"),
  },

  // ─── Uploads ─────────────────────────────────────────────
  upload: (file: File) => {
    if (IS_STATIC_HOST) {
      console.log("[Static Mode] Mocking file upload with local preview URL");
      return Promise.resolve({ url: URL.createObjectURL(file) });
    }
    const formData = new FormData();
    formData.append("file", file);
    return request<{ url: string }>("/upload", {
      method: "POST",
      body: formData,
    });
  },

  // ─── Settings ────────────────────────────────────────────
  settings: {
    get: () => request<{ settings: Record<string, string> }>("/settings"),
    update: (settings: Record<string, string>) =>
      request("/settings", { method: "PUT", body: JSON.stringify({ settings }) }),
  },

  // ─── Admin ───────────────────────────────────────────────
  admin: {
    dashboard: () => request<DashboardData>("/admin/dashboard"),
    orders: (params?: Record<string, string>) => {
      const q = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<{ orders: Order[] }>(`/admin/orders${q}`);
    },
    updateOrder: (id: string, data: Partial<Order>) =>
      request(`/admin/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    customers: () => request<{ customers: Customer[] }>("/admin/customers"),
    messages: () => request<{ messages: ContactMessage[] }>("/admin/messages"),
    markMessageRead: (id: number) =>
      request(`/admin/messages/${id}/read`, { method: "PUT" }),
    deleteMessage: (id: number) =>
      request(`/admin/messages/${id}`, { method: "DELETE" }),
    products: () => request<{ products: Product[] }>("/admin/products"),

    // Admin Reviews
    reviews: () => request<{ reviews: Review[] }>("/admin/reviews"),
    updateReview: (id: number, status: string) =>
      request(`/admin/reviews/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
    deleteReview: (id: number) =>
      request(`/admin/reviews/${id}`, { method: "DELETE" }),

    // Admin Videos
    createVideo: (data: Partial<FeedbackVideo>) =>
      request("/admin/videos", { method: "POST", body: JSON.stringify(data) }),
    deleteVideo: (id: number) =>
      request(`/admin/videos/${id}`, { method: "DELETE" }),

    // Admin Creator Reels
    creatorReels: () => request<{ reels: CreatorReel[] }>("/admin/creator-reels"),
    createCreatorReel: (data: Partial<CreatorReel>) =>
      request("/admin/creator-reels", { method: "POST", body: JSON.stringify(data) }),
    updateCreatorReel: (id: number, data: Partial<CreatorReel>) =>
      request(`/admin/creator-reels/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    deleteCreatorReel: (id: number) =>
      request(`/admin/creator-reels/${id}`, { method: "DELETE" }),

    // Admin Gallery
    createGalleryPhoto: (data: Partial<GalleryPhoto>) =>
      request("/admin/gallery", { method: "POST", body: JSON.stringify(data) }),
    deleteGalleryPhoto: (id: number) =>
      request(`/admin/gallery/${id}`, { method: "DELETE" }),
  },
};

// ─── Types ─────────────────────────────────────────────────
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  addresses?: Address[];
  created_at?: string;
};

export type Address = {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  weight: number;
  purity: string;
  makingCharges: number;
  description: string;
  images: string[];
  featured: number | boolean;
  bestSeller: number | boolean;
  newArrival: number | boolean;
  active: number | boolean;
  attributes?: Record<string, string[]>;
  videoUrl?: string;
  price?: number;
  oldPrice?: number;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  displayOrder: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  shippingAddress: Address;
  contactInfo: { name: string; email: string; phone: string };
  paymentMethod: string;
  paymentStatus: string;
  trackingNumber: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  category: string;
  weight: number;
  makingCharges: number;
  quantity: number;
  price: number;
};

export type OrderCreateData = {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Partial<Address>;
  contactInfo: { name: string; email?: string; phone: string };
  paymentMethod: string;
  userId?: string;
};

export type DashboardData = {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    pendingOrders: number;
    unreadMessages: number;
  };
  recentOrders: Order[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  orderCount: number;
  totalSpent: number;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: number;
  created_at: string;
};

export type WishlistItem = {
  id: number;
  userId: string;
  productId: string;
  name: string;
  category: string;
  weight: number;
  makingCharges: number;
  images: string[];
  purity: string;
  created_at: string;
};

export type Review = {
  id: number;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  status: string;
  created_at: string;
};

export type FeedbackVideo = {
  id: number;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  displayOrder: number;
  created_at: string;
};

export type CreatorReel = {
  id: number;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  displayOrder: number;
  active: number;
  created_at: string;
};

export type GalleryPhoto = {
  id: number;
  imageUrl: string;
  jewelryName: string;
  displayOrder: number;
  created_at: string;
};
