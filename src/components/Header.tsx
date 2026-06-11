import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User, Phone, RefreshCw, LogOut, Settings, Package, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useGoldRates } from "@/contexts/GoldRateContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { navigationData } from "@/data/navigation";
import DesktopNav from "./DesktopNav";
import { NavIcon } from "./NavIcon";

interface HeaderProps {
  onOpenLogin?: () => void;
}

export default function Header({ onOpenLogin }: HeaderProps) {
  const { totalItems, setIsCartOpen } = useCart();
  const { rates, refreshRates } = useGoldRates();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("Search jewelry...");
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const placeholders = [
    "Search Jewelry...",
    "Search Rings...",
    "Search Earrings...",
    "Search Mangalsutra...",
    "Search Bracelets...",
    "Search Necklaces..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % placeholders.length;
      setSearchPlaceholder(placeholders[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const t = setTimeout(() => {
      api.products.search(searchQuery).then(({ products }) => setSearchResults(products)).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <>
      {/* Live Rate Ticker */}
      <div className="bg-secondary text-secondary-foreground text-[10px] md:text-xs py-1.5 font-body border-b border-muted-foreground/10">
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-primary" />
              <span className="font-medium">+91 63566 47453</span>
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-[11px] tracking-wider uppercase">
            <span>
              Gold 24K: <span className="text-primary font-semibold">₹{rates.gold24k.toLocaleString("en-IN")}/g</span>
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span>
              Gold 22K: <span className="text-primary font-semibold">₹{rates.gold22k.toLocaleString("en-IN")}/g</span>
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span>
              Silver: <span className="text-primary font-semibold">₹{rates.silver}/g</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${rates.isLive ? "bg-green-500" : rates.isLoading ? "bg-yellow-500 animate-pulse" : "bg-red-400"}`} />
              <span className="text-muted-foreground text-[10px] hidden xs:inline">
                {rates.isLive ? "Live" : rates.isLoading ? "Updating..." : "Offline"}
              </span>
            </div>
            <button onClick={refreshRates} className="text-muted-foreground hover:text-primary transition-colors p-1" title="Refresh rates">
              <RefreshCw className={`w-3 h-3 ${rates.isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50" : "bg-secondary"}`}>
        <div className="container mx-auto px-4">
          {/* Logo Row */}
          <div className="flex items-center justify-between py-3 md:py-4">
            <div className="flex items-center lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 -ml-2 ${isScrolled ? "text-foreground" : "text-secondary-foreground"}`}>
                <Menu className="w-6 h-6" />
              </button>
              <button 
                onClick={() => { setShowSearch(!showSearch); setSearchQuery(""); }}
                className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-secondary-foreground"}`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <Link to="/" className="flex-1 flex justify-center lg:justify-start">
              <img
                src="/logo.png"
                alt="Mohen Jewellers"
                className="h-10 md:h-14 lg:h-16 w-auto object-contain"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))" }}
              />
            </Link>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => { setShowSearch(!showSearch); setSearchQuery(""); setSearchResults([]); }}
                  className={`hidden md:flex p-2 hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-secondary-foreground"}`}
                >
                  <Search className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, width: 0 }}
                      animate={{ opacity: 1, y: 0, width: 320 }}
                      exit={{ opacity: 0, y: -10, width: 0 }}
                      className="absolute right-0 top-full mt-2 bg-background border border-border shadow-lg z-50"
                    >
                      <div className="flex items-center border-b border-border px-4">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input
                          autoFocus
                          className="w-full px-3 py-3 text-sm font-body bg-transparent focus:outline-none text-foreground"
                          placeholder={searchPlaceholder}
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </div>
                      {searchResults.length > 0 && (
                        <div className="max-h-80 overflow-y-auto">
                          {searchResults.map(p => (
                            <Link
                              key={p.id}
                              to={`/product/${p.id}`}
                              onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-10 h-10 bg-cream flex items-center justify-center rounded-sm flex-shrink-0">
                                <span className="text-xs opacity-40">💍</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-body text-foreground truncate">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground font-body uppercase">{p.category} · {p.weight}g</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchQuery.length >= 2 && searchResults.length === 0 && (
                        <p className="px-4 py-6 text-sm text-muted-foreground font-body text-center">No results found</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => {
                    if (user) {
                      setShowUserMenu(!showUserMenu);
                    } else if (onOpenLogin) {
                      onOpenLogin();
                    } else {
                      navigate("/login");
                    }
                  }}
                  className={`p-2 hover:text-primary transition-colors flex items-center gap-1 ${isScrolled ? "text-foreground" : "text-secondary-foreground"}`}
                >
                  <User className="w-5 h-5" />
                  {user && <ChevronDown className="w-3 h-3 hidden md:block" />}
                </button>
                <AnimatePresence>
                  {showUserMenu && user && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-background border border-border shadow-lg z-50 text-left"
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-body font-semibold text-foreground">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground font-body">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/account" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs font-body text-foreground/70 hover:text-primary hover:bg-muted/50 transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <Link to="/admin" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs font-body text-foreground/70 hover:text-primary hover:bg-muted/50 transition-colors bg-primary/5">
                          <Settings className="w-4 h-4" /> Admin Panel (Always Visible)
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-xs font-body text-foreground/70 hover:text-destructive hover:bg-muted/50 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 hover:text-primary transition-colors ${isScrolled ? "text-foreground" : "text-secondary-foreground"}`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold min-w-[18px] h-[18px]">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <DesktopNav isScrolled={isScrolled} />
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-secondary z-50 p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <img src="/logo.png" alt="Mohen Jewellers" className="h-10 w-auto object-contain" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-secondary-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile live rates */}
              <div className="mb-6 p-3 border border-muted-foreground/20 rounded-sm space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                  <span className={`w-1.5 h-1.5 rounded-full ${rates.isLive ? "bg-green-500" : "bg-red-400"}`} />
                  {rates.isLive ? "Live Rates" : "Offline Rates"} · {rates.lastUpdated}
                </div>
                <div className="text-xs text-secondary-foreground/80 font-body space-y-1">
                  <div className="flex justify-between">
                    <span>Gold 24K</span>
                    <span className="text-primary font-semibold">₹{rates.gold24k.toLocaleString("en-IN")}/g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold 22K</span>
                    <span className="text-primary font-semibold">₹{rates.gold22k.toLocaleString("en-IN")}/g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Silver</span>
                    <span className="text-primary font-semibold">₹{rates.silver}/g</span>
                  </div>
                </div>
              </div>

              {/* Mobile user info */}
              {user && (
                <div className="mb-4 p-3 border border-muted-foreground/20 rounded-sm">
                  <p className="text-sm font-body font-semibold text-secondary-foreground">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{user.email}</p>
                </div>
              )}

              <nav className="flex flex-col gap-1">
                {navigationData.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-3 text-sm tracking-widest uppercase text-secondary-foreground/80 hover:text-primary hover:bg-noir-light/50 transition-colors font-body border-b border-muted-foreground/10 flex items-center gap-2"
                  >
                    <NavIcon label={link.label} className="w-4 h-4 opacity-80" />
                    {link.label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 text-sm tracking-widest uppercase text-secondary-foreground/80 hover:text-primary hover:bg-noir-light/50 transition-colors font-body border-b border-muted-foreground/10">
                      My Account
                    </Link>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 text-sm tracking-widest uppercase text-primary hover:bg-noir-light/50 transition-colors font-body border-b border-muted-foreground/10 bg-primary/5">
                      Admin Panel (Always Visible)
                    </Link>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-3 py-3 text-sm tracking-widest uppercase text-secondary-foreground/80 hover:text-primary hover:bg-noir-light/50 transition-colors font-body border-b border-muted-foreground/10">
                    Login / Register
                  </Link>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
