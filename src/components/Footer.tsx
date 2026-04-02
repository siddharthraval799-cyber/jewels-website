import { Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">

      {/* ── SEO Content Block (same as Rushabh) ── */}
      <div className="border-b border-gray-100 py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <h2 className="text-base font-bold text-[#1a1a1a] mb-3">Buy Online Gold Jewellery Shopping Store in India</h2>
          <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">Your Trusted Destination for Designer Gold &amp; Diamond Jewellery</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Welcome to Mohen Jewellers, your premier online gold jewellery shopping store in India. We take pride in bringing the luxury of a boutique showroom directly to your home. In an era where digital shopping is the norm, we stand out as a specialized gold jewellery store that prioritizes purity, transparency, and exquisite craftsmanship above all else.
          </p>
          <p className="text-xs font-bold text-[#2563eb] mb-1">Why Choose Our Online Gold Jewellery Store?</p>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            While there are many options for online gold jewellery shopping, Mohen Jewellers offers a unique blend of traditional artistry and modern security:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 mb-4">
            <li><strong>Hallmarked Purity:</strong> Every ornament in our store is BIS Hallmarked, ensuring you receive the exact gold karatage you pay for.</li>
            <li><strong>Wide Range of Designs:</strong> From daily wear rings to heavy bridal sets, we are the ultimate shopping store for every occasion.</li>
            <li><strong>Verified Reviews:</strong> Our 4.9-star rating reflects the trust thousands of customers place in our quality and service.</li>
          </ul>
          <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">Seamless Shopping Experience</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            As a dedicated online gold jewellery shopping store in India, we have optimized our platform for a hassle-free experience. Browse, select, and buy with complete confidence, knowing that your precious purchase is fully insured and handled with care.
          </p>
          <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">Crafted For You, Not The Masses</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Let's cut the fluff. You want jewelry that actually stands out, not mass-produced showroom copies. If your big day is right around the corner, skip the stressful market rush. You can confidently{" "}
            <Link to="/products?category=necklace" className="text-[#2563eb] hover:underline">Buy Bridal Wedding Jewellery Online</Link>{" "}
            and secure that heavy, antique bridal glow directly from your couch.
          </p>
          <h3 className="text-sm font-bold text-[#1a1a1a] mb-2">Your Everyday Staples &amp; Heavy Traditionals</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            What about your wrists? Ditch the thin, fragile metals. When you{" "}
            <Link to="/products?category=bangles" className="text-[#2563eb] hover:underline">Buy Gold Bangles online</Link>{" "}
            from us, you get sturdy, dent-resistant pieces built for real daily life. Looking for something bolder for a family function? Go ahead and{" "}
            <Link to="/products?category=more-jewellery" className="text-[#2563eb] hover:underline">Buy Gold Kada Online</Link>{" "}
            to make a solid cultural statement that turns heads.
          </p>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">

          {/* Column 1: Information */}
          <div>
            <h4 className="font-bold text-[13px] text-[#1a1a1a] mb-5">Information</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "The Founder", href: "/about" },
                { label: "Blogs", href: "#" },
                { label: "Vision & Mission", href: "/about" },
                { label: "Why Us", href: "/about" },
                { label: "Honors & Recognition", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-[12.5px] text-gray-500 hover:text-[#b07d3a] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Guides & Policies */}
          <div>
            <h4 className="font-bold text-[13px] text-[#1a1a1a] mb-5">Guides &amp; Policies</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Terms of Service", href: "/policies/terms" },
                { label: "Privacy Policy", href: "/policies/privacy" },
                { label: "Shipping Policy", href: "/policies/shipping" },
                { label: "Returns Policy", href: "/policies/returns" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-[12.5px] text-gray-500 hover:text-[#b07d3a] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Others */}
          <div>
            <h4 className="font-bold text-[13px] text-[#1a1a1a] mb-5">Others</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Book an Appointment", href: "/contact" },
                { label: "Custom made Jewellery", href: "/custom-jewellery" },
                { label: "11 + 1 Monthly Plan", href: "#" },
                { label: "Career", href: "#" },
                { label: "Faqs", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-[12.5px] text-gray-500 hover:text-[#b07d3a] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support & Contact */}
          <div>
            <h4 className="font-bold text-[13px] text-[#1a1a1a] mb-5">Support &amp; Contact</h4>
            <p className="font-semibold text-[12.5px] text-[#1a1a1a] mb-2">Mohen Jewellers</p>
            <p className="text-[12px] text-gray-500 leading-relaxed mb-5">
              319, 320 Super Mall, Nr. Lal Bungalow, New Commercial Mills Staff Society, Ellisbridge, Ahmedabad, Gujarat 380009.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="tel:#" className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-[#b07d3a] group-hover:text-[#b07d3a] transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-[#b07d3a]">Reach Out</span>
              </a>
              <a href="/contact" className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-[#b07d3a] group-hover:text-[#b07d3a] transition-all">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-[#b07d3a]">Get in Touch</span>
              </a>
              <a href="https://wa.me/91" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-[#25D366] group-hover:text-[#25D366] transition-all">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.066.534 4.013 1.471 5.715L.064 23.448l5.915-1.38A11.943 11.943 0 0012 24c6.626 0 12-5.373 12-12S18.626 0 12 0zm0 22c-1.885 0-3.65-.5-5.18-1.373l-.372-.22-3.512.82.858-3.418-.243-.388A9.96 9.96 0 012 12C2 6.478 6.477 2 12 2s10 4.478 10 10-4.477 10-10 10z"/></svg>
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-[#25D366]">Whatsapp</span>
              </a>
              <a href="mailto:info@aurumjewels.com" className="flex flex-col items-center gap-1 group">
                <div className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-[#b07d3a] group-hover:text-[#b07d3a] transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-[#b07d3a]">Email</span>
              </a>
            </div>
          </div>

          {/* Column 5: Brand Card (right side) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="border border-gray-200 rounded-xl p-5 flex flex-col gap-5">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/-my-gem-websit/logo.png"
                  alt="Mohen Jewellers"
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-[11.5px] text-gray-500 leading-relaxed -mt-1">
                A Promise of Quality, Purity, and Beautiful Design
              </p>

              {/* App buttons */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Get the Mohen Jewellers App</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="#" className="bg-black text-white rounded-lg px-2.5 py-2 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0"><path d="M3.18 23.53c.37.21.8.22 1.17.04L14.3 18.3l-2.9-2.9-8.22 8.13zM.3 1.34A1.5 1.5 0 000 2.23v19.54c0 .38.1.73.3 1.03L12 12 .3 1.34zM23.54 10.14L20.7 8.49l-3.2 3.17 3.2 3.17 2.85-1.65c.81-.47.81-1.57-.01-2.04zM4.35.43a1.48 1.48 0 00-1.17.04L11.4 5.7 14.3 8.6 4.35.43z"/></svg>
                    <div>
                      <p className="text-[8px] leading-none opacity-70">Download on the</p>
                      <p className="text-[11px] font-semibold leading-tight">Google Play</p>
                    </div>
                  </a>
                  <a href="#" className="bg-black text-white rounded-lg px-2.5 py-2 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04l-.06.27zM13 3.5C13.73 2.67 14.94 2 16 2c.13 1.2-.35 2.4-1.05 3.27-.7.87-1.87 1.54-3 1.46-.16-1.13.4-2.3 1.05-3.23z"/></svg>
                    <div>
                      <p className="text-[8px] leading-none opacity-70">Download on the</p>
                      <p className="text-[11px] font-semibold leading-tight">App Store</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Row ── */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Find Us On */}
            <div className="flex items-center gap-8 flex-wrap">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Find Us On</p>
                <div className="flex items-center gap-3">
                  {[
                    { icon: <Facebook className="w-4 h-4" />, href: "#" },
                    { icon: <Instagram className="w-4 h-4" />, href: "#" },
                    { icon: <Youtube className="w-4 h-4" />, href: "#" },
                    { icon: <Twitter className="w-4 h-4" />, href: "#" },
                  ].map((s, i) => (
                    <a key={i} href={s.href} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#b07d3a] hover:border-[#b07d3a] transition-all">
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Logistics Partners */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Logistics Partners</p>
                <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                  <img src="https://sequelglobal.com/wp-content/uploads/2021/04/Sequel-Logo-01.png" alt="Sequel" className="h-5" />
                  <img src="https://www.bvclogistics.com/static/media/logo.8d1720d2.svg" alt="BVC" className="h-5" />
                </div>
              </div>

              {/* Payments Accepted */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payments Accepted</p>
                <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                </div>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-gray-400 text-center md:text-right">
              © Mohen Jewellers. All Rights Reserved 2026.{" "}
              <span className="text-gray-300 mx-1">|</span>{" "}
              Designed by <span className="text-[#b07d3a]">Mohen Tech</span>
            </p>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
