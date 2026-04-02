import { useState, useRef } from "react";
import { Upload, ChevronRight, Send, Camera } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CustomJewellery = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    const businessNumber = "916356647453";
    const text = `*New Custom Jewellery Request*%0A%0A` +
      `*Name:* ${form.name}%0A` +
      `*Email:* ${form.email}%0A` +
      `*Phone:* ${form.phone}%0A` +
      `*Budget:* ${form.budget || "Not Specified"}%0A%0A` +
      `*Design Details:*%0A${form.message}%0A%0A` +
      `_Sent from Aurum Jewels Custom Design Portal_`;

    const whatsappUrl = `https://wa.me/${businessNumber}?text=${text}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Redirecting to WhatsApp...");
  };

  const inputClass = "w-full border border-[#e5e7eb] bg-white px-4 py-3 rounded-lg text-sm font-body focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400";
  const labelClass = "text-[13px] font-body font-semibold text-[#1a1a1a] mb-2 block";

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-[#fcf8f3] border-b border-[#f1e9df] py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-body text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-semibold">Customize Jewellery</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-12">
           <div className="flex justify-center mb-6">
              <div className="w-12 h-px bg-[#d1d5db] self-center" />
              <div className="w-3 h-3 border border-[#967C6A] rotate-45 mx-3" />
              <div className="w-12 h-px bg-[#d1d5db] self-center" />
           </div>
           <h1 className="font-display text-3xl md:text-4xl text-[#1a1a1a] mb-4">
              Create Jewellery as Unique as You Are
           </h1>
           <p className="font-body text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Create jewellery that's uniquely yours. Personalized designs crafted to match your style.
           </p>
        </div>

        <div className="max-w-5xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-[#fdf9f4] border border-[#f1e9df] rounded-[32px] overflow-hidden"
           >
              <form onSubmit={handleWhatsAppSubmit} className="p-6 md:p-12">
                 <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Left Column: Form Details */}
                    <div className="space-y-6">
                       <div>
                          <label className={labelClass}>Name <span className="text-red-500">*</span></label>
                          <input 
                            placeholder="First Name" 
                            className={inputClass}
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                          />
                       </div>
                       
                       <div>
                          <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            className={inputClass}
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                          />
                       </div>

                       <div>
                          <label className={labelClass}>Phone No. <span className="text-red-500">*</span></label>
                          <input 
                            type="tel" 
                            placeholder="Phone No." 
                            className={inputClass}
                            value={form.phone}
                            onChange={(e) => setForm({...form, phone: e.target.value})}
                          />
                       </div>

                       <div>
                          <label className={labelClass}>Budget</label>
                          <input 
                            placeholder="Budget" 
                            className={inputClass}
                            value={form.budget}
                            onChange={(e) => setForm({...form, budget: e.target.value})}
                          />
                       </div>
                    </div>

                    {/* Right Column: Message & Upload */}
                    <div className="space-y-6">
                       <div>
                          <label className={labelClass}>Details of Design <span className="text-red-500">*</span></label>
                          <textarea 
                            placeholder="Message" 
                            className={`${inputClass} h-[135px] resize-none pt-4`}
                            value={form.message}
                            onChange={(e) => setForm({...form, message: e.target.value})}
                          />
                       </div>

                       <div className="relative group">
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleImageChange}
                          />
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`h-[180px] border-2 border-dashed border-[#e5e7eb] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-white/50 group-hover:border-primary/40 bg-white shadow-inner relative overflow-hidden`}
                          >
                             {imagePreview ? (
                                <>
                                   <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
                                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Camera className="w-8 h-8 text-white" />
                                   </div>
                                </>
                             ) : (
                                <>
                                   <div className="w-12 h-12 bg-[#fdf9f4] rounded-full flex items-center justify-center mb-3">
                                      <Upload className="w-6 h-6 text-primary" />
                                   </div>
                                   <span className="font-display text-lg font-bold text-[#1a1a1a]">Upload Image</span>
                                   <p className="text-[11px] text-gray-400 mt-1 font-body">Image size must be less than 2MB</p>
                                </>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 flex justify-center">
                    <button 
                      type="submit"
                      className="group relative px-16 py-4 bg-gradient-to-r from-[#967C6A] to-[#C3A995] text-white rounded-full font-body font-bold text-sm tracking-[0.2em] uppercase shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 overflow-hidden"
                    >
                       <span className="relative z-10 flex items-center gap-3">
                          Submit <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                       </span>
                    </button>
                 </div>
              </form>
           </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CustomJewellery;
