import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navigationData, MainNavItem } from "@/data/navigation";

interface DesktopNavProps {
  isScrolled: boolean;
}

const DesktopNav = ({ isScrolled }: DesktopNavProps) => {
  const [activeMenu, setActiveMenu] = useState<MainNavItem | null>(null);

  return (
    <nav className="hidden lg:block w-full border-t border-muted-foreground/10 relative">
      <div className="flex items-center justify-center gap-1 py-2.5">
        {navigationData.map((link) => {
          const hasMegaMenu = !!link.megaMenu;
          const isKids = link.label === "Kids Collections";
          const isMensOrCollections = !link.megaMenu?.prices && link.megaMenu?.styles;

          return (
            <div
              key={link.label}
              onMouseEnter={() => setActiveMenu(link)}
              onMouseLeave={() => setActiveMenu(null)}
              className="group"
            >
              <Link
                to={link.href}
                className={`px-4 py-1.5 text-xs tracking-[0.15em] uppercase hover:text-primary transition-colors duration-300 font-body font-medium flex items-center gap-1
                  ${isScrolled ? "text-foreground/80" : "text-secondary-foreground/80"}
                `}
              >
                {link.label}
              </Link>

              {/* Mega Menu Dropdown */}
              {hasMegaMenu && activeMenu?.label === link.label && (
                <div className="absolute left-0 top-full w-full bg-background border-t border-border shadow-soft z-[100]">
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="container mx-auto px-4 py-8 grid grid-cols-12 gap-6"
                  >
                    
                    {/* LAYOUT 1: KIDS COLLECTIONS (Image Cards Only) */}
                    {isKids && (
                      <div className="col-span-12">
                        <div className="grid grid-cols-7 gap-4">
                          {link.megaMenu!.exclusiveDesigns.map((design) => (
                            <Link key={design.label} to={design.href} className="group block text-center">
                              <div className="aspect-square bg-cream rounded-sm overflow-hidden mb-3 shadow-sm border border-border/40 pb-0 relative">
                                <img src={design.image} alt={design.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                              </div>
                              <span className="text-[11px] text-secondary-foreground font-body font-medium break-words">
                                {design.label}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* LAYOUT 2: MENS JEWELLERY or COLLECTIONS (1 List Column, Rest Image Cards) */}
                    {isMensOrCollections && !isKids && (
                      <>
                        <div className="col-span-12 md:col-span-4 lg:col-span-3 border-r border-border/50 pr-4">
                          <h3 className="text-secondary-foreground font-body text-xs uppercase tracking-wider mb-4 border-b border-border pb-2 border-dashed font-semibold">
                            {link.megaMenu!.stylesTitle || "By Popular Style"}
                          </h3>
                          {link.megaMenu!.styles && (
                            <ul className={link.megaMenu!.styles[0]?.icon ? "grid grid-cols-2 gap-y-6 gap-x-2" : "flex flex-col gap-y-3"}>
                              {link.megaMenu!.styles.map((item) => (
                                <li key={item.label}>
                                  <Link to={item.href} className={`flex ${item.icon ? 'flex-col items-center text-center gap-2' : 'items-center gap-2'} w-full group/item`}>
                                    {item.icon && (
                                       <div className="w-12 h-12 rounded-full overflow-hidden border border-border group-hover/item:border-primary transition-colors">
                                         <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                                       </div>
                                    )}
                                    <span className="text-[11px] text-muted-foreground group-hover/item:text-primary transition-colors font-body tracking-wide">
                                      {item.label}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="col-span-12 md:col-span-8 lg:col-span-9 pl-4">
                          {link.megaMenu!.exclusiveDesigns[0]?.large ? (
                             // Single large card
                             <div className="w-full h-full rounded-sm overflow-hidden relative group cursor-pointer border border-border/50">
                                <img src={link.megaMenu!.exclusiveDesigns[0].image} alt="Explore" className="w-full h-[320px] object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm py-4 text-center">
                                  <span className="text-white font-display text-xl tracking-widest uppercase">{link.megaMenu!.exclusiveDesigns[0].label}</span>
                                </div>
                             </div>
                          ) : (
                             // 4 items grid
                             <div className="grid grid-cols-4 gap-4">
                               {link.megaMenu!.exclusiveDesigns.map((design) => (
                                 <Link key={design.label} to={design.href} className="group block text-center bg-cream/30 p-2 rounded-sm border border-border/40">
                                   <div className="aspect-square bg-cream rounded-sm overflow-hidden mb-3 shadow-sm">
                                     <img src={design.image} alt={design.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                   </div>
                                   <span className="text-[11px] text-secondary-foreground font-body uppercase bg-white/80 px-2 py-1.5 rounded w-full block shadow-sm border border-border/30">
                                     {design.label}
                                   </span>
                                 </Link>
                               ))}
                             </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* LAYOUT 3: DEFAULT (Rings, Earrings, Bangles, Necklaces, etc) */}
                    {!isKids && !isMensOrCollections && (
                      <>
                        <div className="col-span-12 md:col-span-7 lg:col-span-8 flex justify-between pr-8 border-r border-border/50">
                          {/* Column 1 & 2: By Popular Style */}
                          {link.megaMenu!.styles && (
                            <div className="w-1/3 pr-4">
                              <h3 className="text-secondary-foreground font-body text-xs uppercase tracking-wider mb-4 border-b border-border pb-2 border-dashed font-semibold">
                                By Popular Style
                              </h3>
                              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                                {link.megaMenu!.styles.map((item) => (
                                  <li key={item.label}>
                                    <Link to={item.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-body tracking-wide">
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Column 3: By Price Range */}
                          {link.megaMenu!.prices && (
                            <div className="w-1/4 px-2">
                              <h3 className="text-secondary-foreground font-body text-xs uppercase tracking-wider mb-4 border-b border-border pb-2 border-dashed font-semibold">
                                By Price Range
                              </h3>
                              <ul className="flex flex-col gap-y-2.5">
                                {link.megaMenu!.prices.map((item) => (
                                  <li key={item.label}>
                                    <Link to={item.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-body tracking-wide">
                                      {item.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Column 4: By Karat & Shop For */}
                          <div className="w-1/4 px-2">
                            {link.megaMenu!.karats && link.megaMenu!.karats.length > 0 && (
                              <>
                                <h3 className="text-secondary-foreground font-body text-xs uppercase tracking-wider mb-4 border-b border-border pb-2 border-dashed font-semibold">
                                  By Karat
                                </h3>
                                <ul className="flex flex-col gap-y-2.5 mb-6">
                                  {link.megaMenu!.karats.map((item) => (
                                    <li key={item.label}>
                                      <Link to={item.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-body tracking-wide">
                                        {item.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}

                            {link.megaMenu!.shopFor && link.megaMenu!.shopFor.length > 0 && (
                              <>
                                <h3 className="text-secondary-foreground font-body text-xs uppercase tracking-wider mb-4 border-b border-border pb-2 border-dashed font-semibold">
                                  Shop For
                                </h3>
                                <ul className="flex flex-col gap-y-2.5">
                                  {link.megaMenu!.shopFor.map((item) => (
                                    <li key={item.label}>
                                      <Link to={item.href} className="text-[11px] text-muted-foreground hover:text-primary transition-colors font-body tracking-wide">
                                        {item.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right Image Section */}
                        <div className="col-span-12 md:col-span-5 lg:col-span-4 pl-4">
                           <h3 className="text-primary font-body text-xs uppercase tracking-wider mb-4 text-center">
                              Our Exclusive Designs
                           </h3>
                           <div className={`grid ${link.megaMenu!.exclusiveDesigns.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
                              {link.megaMenu!.exclusiveDesigns.map((design) => (
                                <Link key={design.label} to={design.href} className="group block text-center">
                                  <div className="aspect-square bg-cream rounded-sm overflow-hidden mb-2 shadow-sm border border-border/40 pb-0">
                                     <img src={design.image} alt={design.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                  </div>
                                  <span className="text-[10px] text-secondary-foreground font-body tracking-widest uppercase bg-muted/30 px-2 py-1 rounded w-full block">
                                    {design.label}
                                  </span>
                                </Link>
                              ))}
                           </div>
                        </div>
                      </>
                    )}

                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default DesktopNav;
