import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MessageSquare, Phone } from "lucide-react";

const Login = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [method, setMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [loading, setLoading] = useState(false);
  const { login, whatsappLogin, user } = useAuth();
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [emailForm, setEmailForm] = useState({ email: "", password: "" });

  // If already logged in, redirect
  if (user) {
    navigate(user.role === "admin" ? "/admin" : "/account");
    return null;
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    try {
      await api.auth.sendWhatsappOtp(phoneNumber);
      setStep("otp");
      toast.success("OTP sent to your WhatsApp!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    setLoading(true);
    try {
      await whatsappLogin(phoneNumber, otp);
      toast.success("Welcome to Aurum Jewels!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email || !emailForm.password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      await login(emailForm.email, emailForm.password);
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-border bg-background px-4 py-3 text-sm font-body focus:border-primary focus:outline-none transition-colors rounded-lg";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl text-foreground">
              {method === "whatsapp" ? "Secure WhatsApp Login" : "Admin / Email Login"}
            </h1>
            <p className="text-muted-foreground text-sm font-body mt-2">
              {method === "whatsapp" 
                ? "Fastest way to shop and track your orders" 
                : "Standard login for administrators and existing accounts"}
            </p>
          </div>

          <div className="bg-white border border-border rounded-xl shadow-xl overflow-hidden p-8">
            <AnimatePresence mode="wait">
              {method === "whatsapp" ? (
                <motion.div
                  key="whatsapp-flow"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  {step === "phone" ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                      <div className="text-left">
                        <label className="block text-sm font-medium font-body mb-2 text-[#8B6E4E]">
                          WhatsApp Number
                        </label>
                        <div className="flex border border-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                          <div className="bg-muted px-4 py-3 flex items-center gap-1 border-r border-border font-body text-sm">
                            <span>🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 text-sm font-body outline-none"
                            placeholder="99999 99999"
                            maxLength={10}
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            required
                          />
                        </div>
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-[#8B6E4E] hover:bg-[#735A3F] text-white py-3.5 rounded-full text-sm font-body tracking-wider transition-colors shadow-sm flex justify-center items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><MessageSquare className="w-4 h-4" /> Continue with WhatsApp</>}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <div className="text-center">
                        <label className="block text-sm font-medium font-body mb-2 text-[#8B6E4E]">
                          Verification Code
                        </label>
                        <p className="text-[11px] text-muted-foreground mb-4">
                          Sent to +91 {phoneNumber} · <button type="button" onClick={() => setStep("phone")} className="text-primary hover:underline">Change</button>
                        </p>
                        <input
                          type="text"
                          className="w-full border border-border rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em] font-body outline-none focus:border-primary"
                          placeholder="------"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          required
                          autoFocus
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={loading || otp.length < 6} 
                        className="w-full bg-[#8B6E4E] hover:bg-[#735A3F] text-white py-3.5 rounded-full text-sm font-body tracking-wider transition-colors shadow-sm flex justify-center items-center gap-2"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Login"}
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="email-flow"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <form onSubmit={handleEmailLogin} className="space-y-5">
                    <div>
                      <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Email</label>
                      <input 
                        type="email" 
                        className={inputClass} 
                        value={emailForm.email} 
                        onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })} 
                        placeholder="your@email.com" 
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1.5 block font-semibold">Password</label>
                      <input 
                        type="password" 
                        className={inputClass} 
                        value={emailForm.password} 
                        onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })} 
                        placeholder="••••••••" 
                        required
                      />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground py-3.5 rounded-lg text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-muted transition-colors disabled:opacity-50">
                      {loading ? "Signing in..." : "Sign In"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 pt-6 border-t border-border">
              <button 
                onClick={() => { setMethod(method === "whatsapp" ? "email" : "whatsapp"); setStep("phone"); }} 
                className="w-full text-xs font-body text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                {method === "whatsapp" ? "Login with Email / Admin Credentials" : "Back to WhatsApp Login"}
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted-foreground font-body mt-8 uppercase tracking-widest">
            By continuing, you agree to our{" "}
            <Link to="/policies/terms" className="text-primary hover:underline">Terms</Link> &{" "}
            <Link to="/policies/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
