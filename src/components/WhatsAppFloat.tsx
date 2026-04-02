import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const phoneNumber = "916356647453";
  const message = "Hi Mohen Jewellers, I'm interested in your collection. Can you help me?";

  const handleClick = () => {
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-[999] bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-secondary-foreground text-xs font-semibold py-1.5 px-3 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border">
        Chat with us
      </span>
    </button>
  );
};

export default WhatsAppFloat;
