import React, { useState } from "react";
import { X, Video, User, Phone, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCallModal = ({ isOpen, onClose }: VideoCallModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    pincode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate real-time work
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Video Call Scheduled!",
      description: "Our team will contact you on WhatsApp shortly.",
    });
    
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#FFFBF7] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Side - Image */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                <img
                  src="/-my-gem-websit/images/video-call-thumb.png"
                  alt="Video Call"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-8 text-center md:text-left leading-tight">
                Convenient video calls, just a click away!
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FCF8F4] border border-[#F3E6D8] rounded-lg py-3.5 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AD8B73]/20 focus:border-[#AD8B73] transition-all"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-500">IN +91</span>
                    <div className="w-[1px] h-4 bg-gray-200 ml-1" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
                    className="w-full bg-[#FCF8F4] border border-[#F3E6D8] rounded-lg py-3.5 pl-24 pr-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AD8B73]/20 focus:border-[#AD8B73] transition-all"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
                    className="w-full bg-[#FCF8F4] border border-[#F3E6D8] rounded-lg py-3.5 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#AD8B73]/20 focus:border-[#AD8B73] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8B5E3C] hover:bg-[#734A2F] text-white py-4 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70"
                >
                  <Video className="w-5 h-5" />
                  {isSubmitting ? "Scheduling..." : "SCHEDULE A VIDEO CALL"}
                </button>
              </form>

              <div className="mt-8 bg-[#FFF4E8] rounded-xl p-4 text-center">
                <p className="text-[#8B5E3C] text-sm font-medium">
                  Real images and videos will be shared via whatsapp
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoCallModal;
