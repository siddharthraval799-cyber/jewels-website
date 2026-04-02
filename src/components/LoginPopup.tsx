import { useState } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginPopup = ({ isOpen, onClose }: LoginPopupProps) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { whatsappLogin } = useAuth();

  const handleClose = () => {
    onClose();
    sessionStorage.setItem("hasSeenLoginPopup", "true");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    try {
      setLoading(true);
      await api.auth.sendWhatsappOtp(phoneNumber);
      setStep("otp");
      toast.success("OTP sent to your WhatsApp!");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    try {
      setLoading(true);
      await whatsappLogin(phoneNumber, otp);
      toast.success("Logged in successfully!");
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Modal box — stop propagation so clicking inside doesn't close */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="w-full max-w-3xl flex rounded-2xl overflow-hidden shadow-2xl relative"
            style={{ minHeight: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ═══════════════════════════════════════
                LEFT PANEL — Dark brown leather
                (same as Rushabh: icon + lines + name)
            ═══════════════════════════════════════ */}
            <div
              className="hidden md:flex w-[42%] flex-col items-center justify-center relative overflow-hidden p-10"
              style={{ background: "#5C3D2E" }}
            >
              {/* Leather texture overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("https://www.transparenttextures.com/patterns/leather.png")`,
                  opacity: 0.35,
                  mixBlendMode: "overlay",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/20" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-5 w-full">

                {/* Lotus icon in white — like Rushabh's calligraphy icon */}
                <svg
                  viewBox="0 0 100 95"
                  className="w-24 h-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Petals */}
                  <path d="M50 5 C50 5 36 22 36 36 C36 44.8 42.3 52 50 52 C57.7 52 64 44.8 64 36 C64 22 50 5 50 5Z" fill="white" fillOpacity="0.95"/>
                  <path d="M50 12 C50 12 20 28 20 46 C20 57.6 33.4 67 50 67 C66.6 67 80 57.6 80 46 C80 28 50 12 50 12Z" fill="white" fillOpacity="0.6"/>
                  <path d="M50 20 C50 20 8 36 8 58 C8 72.4 26.8 84 50 84 C73.2 84 92 72.4 92 58 C92 36 50 20 50 20Z" fill="white" fillOpacity="0.25"/>
                  {/* Diamond/gem in center petal */}
                  <polygon points="50,22 55,30 50,38 45,30" fill="white" fillOpacity="0.9"/>
                  {/* Stem */}
                  <rect x="47.5" y="82" width="5" height="10" rx="2.5" fill="white" fillOpacity="0.8"/>
                  {/* Base line */}
                  <rect x="24" y="90" width="52" height="4" rx="2" fill="white" fillOpacity="0.7"/>
                </svg>

                {/* Horizontal rule */}
                <div className="w-full flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/25" />
                </div>

                {/* Brand name — MOHEN | JEWELLERS (like RUSHABH | JEWELS) */}
                <div className="text-center">
                  <p className="text-white font-display text-2xl font-bold tracking-[0.12em] uppercase leading-tight">
                    MOHEN
                  </p>
                  <div className="w-8 h-px bg-white/40 mx-auto my-1.5" />
                  <p className="text-white/80 font-display text-base font-light tracking-[0.25em] uppercase">
                    JEWELLERS
                  </p>
                </div>

                {/* Bottom rule */}
                <div className="w-full flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/25" />
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════
                RIGHT PANEL — White, login form
                (pixel-perfect match to Rushabh)
            ═══════════════════════════════════════ */}
            <div className="flex-1 bg-white flex flex-col justify-center items-center px-8 py-10 md:px-12 relative">

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full max-w-[340px]">

                <AnimatePresence mode="wait">
                  {step === "phone" ? (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Heading — exact Rushabh format */}
                      <h2 className="text-[19px] font-bold text-gray-900 text-center leading-snug mb-2">
                        Welcome to Mohen Jewellers -{" "}
                        <span className="text-[#8B6E4E]">Where Elegance Shines!</span>
                      </h2>

                      {/* Sign up subtext — gold link style like Rushabh */}
                      <p className="text-center text-xs mb-6">
                        <span className="text-gray-500">Sign Up or </span>
                        <a href="#" className="text-[#b07d3a] font-medium hover:underline">Sign In</a>
                        <span className="text-gray-500"> for Exclusive </span>
                        <span className="text-[#b07d3a] font-medium">Mohen Jewellers Benefits!</span>
                      </p>

                      <form onSubmit={handleSendOtp} className="space-y-4">
                        {/* "Enter Your WhatsApp Number" section */}
                        <div>
                          <p className="text-[13px] font-bold text-gray-800 text-center mb-1">
                            Enter Your WhatsApp Number
                          </p>
                          <p className="text-[11px] text-gray-400 text-center mb-4 leading-snug">
                            We'll send you a verification code on{" "}
                            <span className="text-[#25D366] font-medium">whatsapp</span>{" "}
                            to confirm it's you.
                          </p>

                          {/* Phone input — flag + dropdown + number */}
                          <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden bg-gray-50 focus-within:border-[#8B6E4E] focus-within:ring-1 focus-within:ring-[#8B6E4E]/30 transition-all">
                            <div className="flex items-center gap-1.5 px-3 py-3 border-r border-gray-200 bg-white shrink-0">
                              <span className="text-lg">🇮🇳</span>
                              <ChevronDown className="w-3 h-3 text-gray-400" />
                              <span className="text-sm text-gray-700 font-medium ml-0.5">+91</span>
                            </div>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                              className="w-full px-3 py-3 text-sm bg-gray-50 outline-none text-gray-800 placeholder-gray-400"
                              placeholder="Mobile Number"
                              maxLength={10}
                              required
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Terms */}
                        <p className="text-[10.5px] text-gray-400 text-center">
                          By continuing, I agree to{" "}
                          <a href="/policies" className="text-[#b07d3a] hover:underline">Terms of use</a>
                          {" "}and{" "}
                          <a href="/policies" className="text-[#b07d3a] hover:underline">Privacy Policy</a>
                        </p>

                        {/* Continue button — exact Rushabh brown rounded style */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3.5 rounded-full text-white text-sm font-semibold tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, #A0724A, #7A5235)" }}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="otp"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h2 className="text-[19px] font-bold text-gray-900 text-center leading-snug mb-2">
                        Verify Your Number
                      </h2>
                      <p className="text-xs text-gray-500 text-center mb-6">
                        Enter the 6-digit OTP sent to{" "}
                        <span className="font-semibold text-gray-800">+91 {phoneNumber}</span>{" "}
                        <button onClick={() => setStep("phone")} className="text-[#b07d3a] hover:underline ml-1 text-[10px]">
                          (Change)
                        </button>
                      </p>

                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <p className="text-[13px] font-bold text-gray-800 text-center mb-3">
                            Verification Code
                          </p>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-[#8B6E4E] focus:ring-1 focus:ring-[#8B6E4E]/30 bg-gray-50 transition-all"
                            placeholder="······"
                            maxLength={6}
                            autoFocus
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loading || otp.length < 6}
                          className="w-full py-3.5 rounded-full text-white text-sm font-semibold tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, #A0724A, #7A5235)" }}
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Login"}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopup;
