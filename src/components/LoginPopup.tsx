import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
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
          className="fixed inset-0 z-[9000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative"
            style={{ minHeight: "500px" }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors bg-white/50 backdrop-blur rounded-full md:bg-transparent"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Side - Brandy/Gold Theme with Texture */}
            <div className="w-full md:w-1/2 bg-[#5d4037] relative overflow-hidden flex items-center justify-center p-8 min-h-[200px] md:min-h-full">
              {/* Wooden/Leather Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-40 mix-blend-overlay"
                style={{
                  backgroundImage: `url("https://www.transparenttextures.com/patterns/leather.png")`,
                  backgroundColor: "#5d4037"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
              
              <div className="relative z-10 text-center flex flex-col items-center">
                 <div className="w-24 h-24 border border-white/20 rounded flex items-center justify-center mb-6 backdrop-blur-sm bg-white/5">
                    <span className="text-white font-display text-4xl font-bold tracking-widest">A<span className="text-primary">J</span></span>
                 </div>
                 <h2 className="text-white font-display text-2xl tracking-[0.2em] uppercase mb-2 font-semibold">Aurum Jewels</h2>
                 <div className="w-12 h-px bg-primary/50 mb-4" />
                 <p className="text-white/80 font-body text-[10px] uppercase tracking-[0.4em] font-medium">Heritage & Luxury</p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 md:p-12 text-center relative">
              <div className="w-full max-w-sm">
                <h3 className="text-xl md:text-2xl font-display text-secondary-foreground mb-3 font-semibold leading-tight">
                  Welcome to Aurum Jewels -<br/>
                  <span className="text-primary italic font-serif text-lg md:text-xl">Where Elegance Shines!</span>
                </h3>
              
              <AnimatePresence mode="wait">
                {step === "phone" ? (
                   <motion.div
                     key="phone-step"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="w-full max-w-sm"
                   >
                     <p className="text-xs text-muted-foreground font-body mb-8">
                       Sign Up or Sign In for Exclusive Rushabh Jewels Benefits
                     </p>

                     <form onSubmit={handleSendOtp} className="w-full space-y-6">
                       <div className="text-left">
                         <label className="block text-sm text-[#8B6E4E] font-medium font-body mb-1">
                           Enter Your WhatsApp Number
                         </label>
                         <p className="text-[10px] text-muted-foreground font-body mb-4">
                           We'll send you a verification code on WhatsApp to confirm it's you.
                         </p>
                         
                         <div className="flex border border-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                           <div className="bg-muted px-4 py-3 flex items-center gap-2 border-r border-border h-full">
                             <span>🇮🇳</span>
                             <span className="text-sm font-body text-secondary-foreground">+91</span>
                           </div>
                           <input
                             type="tel"
                             value={phoneNumber}
                             onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                             className="w-full px-4 py-3 text-sm font-body outline-none focus:outline-none"
                             placeholder="Mobile Number"
                             maxLength={10}
                             required
                           />
                         </div>
                       </div>

                       <div className="text-[10px] text-muted-foreground font-body text-center">
                         By continuing, I agree to <a href="#" className="text-primary hover:underline">Terms of use</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                       </div>

                       <button
                         type="submit"
                         disabled={loading}
                         className="w-full bg-[#8B6E4E] hover:bg-[#735A3F] disabled:opacity-70 text-white py-3.5 rounded-full text-sm font-body tracking-wider transition-colors shadow-sm flex justify-center items-center gap-2"
                       >
                         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue via WhatsApp"}
                       </button>
                     </form>
                   </motion.div>
                ) : (
                   <motion.div
                     key="otp-step"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="w-full max-w-sm"
                   >
                     <p className="text-xs text-muted-foreground font-body mb-8">
                       Please enter the 6-digit code sent to<br/>
                       <span className="font-semibold text-foreground">+91 {phoneNumber}</span>
                       <button onClick={() => setStep("phone")} className="ml-2 text-primary hover:underline text-[10px]">(Change)</button>
                     </p>

                     <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
                       <div className="text-left">
                         <label className="block text-sm text-[#8B6E4E] font-medium font-body mb-2 text-center">
                           Verification Code
                         </label>
                         
                         <div className="flex justify-center border border-border rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                           <input
                             type="text"
                             value={otp}
                             onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                             className="w-full px-4 py-3 text-center text-lg tracking-widest font-body outline-none focus:outline-none"
                             placeholder="------"
                             maxLength={6}
                             required
                             autoFocus
                           />
                         </div>
                       </div>

                       <button
                         type="submit"
                         disabled={loading || otp.length < 6}
                         className="w-full bg-[#8B6E4E] hover:bg-[#735A3F] disabled:opacity-70 text-white py-3.5 rounded-full text-sm font-body tracking-wider transition-colors shadow-sm flex justify-center items-center gap-2"
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
