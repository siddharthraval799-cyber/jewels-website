import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { navigationData, MainNavItem } from "@/data/navigation";

interface DesktopNavProps {
  isScrolled: boolean;
}

import { NavIcon } from "@/components/NavIcon";

const DesktopNav = ({ isScrolled }: DesktopNavProps) => {
  const [activeMenu, setActiveMenu] = useState<MainNavItem | null>(null);

  // Common Header Style
  const headerClass = "text-primary font-body text-[13px] tracking-wide mb-4 border-b border-border/60 pb-2 border-dashed font-medium capitalize";
  // Common List Item Style
  const liClass = "text-[12px] text-foreground/85 hover:text-primary transition-colors font-body";

  return (
    <nav className="hidden lg:block w-full border-t border-muted-foreground/10 relative">
      <div className="flex items-center justify-center gap-1 py-1">
        {navigationData.map((link) => {
          const hasMegaMenu = !!link.megaMenu;
          const isKids = link.label === "Kids Collections";
          const isCollectionsList = link.label === "Collections";
          const isMoreJewellery = link.label === "More Jewellery";
          const isMensOrCollections = !link.megaMenu?.prices && link.megaMenu?.styles && !isKids && !isCollectionsList && !isMoreJewellery;

          return (
            <div
              key={link.label}
              onMouseEnter={() => setActiveMenu(link)}
              onMouseLeave={() => setActiveMenu(null)}
              className="group"
            >
              <Link
                to={link.href}
                className={`px-3 xl:px-4 py-3 text-[11px] xl:text-[12px] font-semibold tracking-wider hover:text-primary transition-colors duration-300 font-body flex items-center gap-1.5 uppercase
                  ${isScrolled ? "text-foreground/90" : "text-secondary-foreground/90"}
                `}
              >
                <NavIcon label={link.label} className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                {link.label}
              </Link>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {hasMegaMenu && activeMenu?.label === link.label && (
                  <div className="absolute left-0 top-full w-full bg-white border-t border-border shadow-soft z-[1000] overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="container mx-auto px-4 xl:px-8 py-8 grid grid-cols-12 gap-6 bg-white"
                    >
                      
                      {/* LAYOUT 1: KIDS COLLECTIONS (Image Cards Only) */}
                      {isKids && (
                        <div className="col-span-12">
                          <div className="grid grid-cols-7 gap-4 xl:gap-6">
                            {link.megaMenu!.exclusiveDesigns.map((design) => (
                              <Link key={design.label} to={design.href} className="group flex flex-col rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow border border-border/40">
                                <div className="aspect-square bg-cream overflow-hidden">
                                  <img src={design.image} alt={design.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                </div>
                                <div className="w-full py-2.5 text-center bg-[#F3EFEA]">
                                  <span className="text-[12px] text-foreground font-body font-medium">
                                    {design.label}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* LAYOUT 2: MENS JEWELLERY or COLLECTIONS */}
                      {isMensOrCollections && !isKids && (
                        <>
                          <div className="col-span-12 md:col-span-8 lg:col-span-9 pr-6">
                            {link.megaMenu!.exclusiveDesigns[0]?.large ? (
                               <div className="w-full h-[280px] rounded-md overflow-hidden relative group cursor-pointer">
                                  <img src={link.megaMenu!.exclusiveDesigns[0].image} alt="Explore" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                                    <span className="text-white font-display text-2xl tracking-widest uppercase">{link.megaMenu!.exclusiveDesigns[0].label}</span>
                                  </div>
                               </div>
                            ) : (
                               // 4 items grid
                               <div className="grid grid-cols-4 gap-6">
                                 {link.megaMenu!.exclusiveDesigns.map((design) => (
                                   <Link key={design.label} to={design.href} className="group flex flex-col rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-all border border-border/40">
                                     <div className="aspect-square bg-[#ECE8E5] overflow-hidden">
                                       <img src={design.image} alt={design.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                     </div>
                                     <div className="w-full py-2.5 text-center bg-[#F3EFEA]">
                                       <span className="text-[12px] text-foreground font-body font-medium">
                                         {design.label}
                                       </span>
                                     </div>
                                   </Link>
                                 ))}
                               </div>
                            )}
                          </div>

                          <div className="col-span-12 md:col-span-4 lg:col-span-3 pl-6">
                            <h3 className={headerClass}>
                              {link.megaMenu!.stylesTitle || "By Popular Style"}
                            </h3>
                            {link.megaMenu!.styles && (
                              <ul className={link.megaMenu!.styles[0]?.icon ? "grid grid-cols-2 gap-y-4 gap-x-2" : "flex flex-col gap-y-3"}>
                                {link.megaMenu!.styles.map((item) => (
                                  <li key={item.label}>
                                    <Link to={item.href} className={`flex ${item.icon ? 'flex-col items-center text-center gap-2' : 'items-center gap-2'} w-full group/item`}>
                                      {item.icon && (
                                         <div className="w-14 h-14 rounded-full overflow-hidden border border-border group-hover/item:border-primary transition-colors bg-white">
                                           <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                                         </div>
                                      )}
                                      <span className={`${liClass} group-hover/item:text-primary`}>
                                        {item.label}
                                      </span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </>
                      )}

                      {/* LAYOUT 4: COLLECTIONS (4-column raw list) */}
                      {isCollectionsList && (
                        <div className="col-span-12 px-2">
                           <div className="columns-2 md:columns-3 lg:columns-4 gap-x-8 gap-y-4">
                             {link.megaMenu!.styles?.map((item) => (
                               <Link key={item.label} to={item.href} className="flex items-center gap-2 group/item text-[13px] text-foreground/80 hover:text-primary transition-colors font-body mb-4 break-inside-avoid max-w-fit">
                                 <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] text-muted-foreground/40 group-hover/item:text-primary transition-colors shrink-0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                 <span className="group-hover/item:translate-x-1 transition-transform">{item.label}</span>
                               </Link>
                             ))}
                           </div>
                        </div>
                      )}

                      {/* LAYOUT 5: MORE JEWELLERY (Icons Left, Image Right) */}
                      {isMoreJewellery && (
                        <>
                          <div className="col-span-12 md:col-span-7 lg:col-span-8 pr-6">
                            <ul className="grid grid-cols-2 gap-y-6 gap-x-4">
                              {link.megaMenu!.styles?.map((item) => (
                                <li key={item.label}>
                                  <Link to={item.href} className="flex items-center gap-5 group/item max-w-fit">
                                    {item.icon && (
                                       <div className="w-[52px] h-[52px] rounded-full overflow-hidden border border-border group-hover/item:border-primary transition-colors bg-white shrink-0 p-1">
                                         <div className="w-full h-full rounded-full overflow-hidden">
                                            <img src={item.icon} alt={item.label} className="w-full h-full object-cover" />
                                         </div>
                                       </div>
                                    )}
                                    <span className={`${liClass} group-hover/item:text-primary font-medium text-[13px]`}>
                                      {item.label}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="col-span-12 md:col-span-5 lg:col-span-4 pl-6 border-l border-border/40">
                            {link.megaMenu!.exclusiveDesigns?.[0] && (
                               <Link to={link.megaMenu!.exclusiveDesigns[0].href} className="w-full h-[300px] rounded-md overflow-hidden relative group cursor-pointer shadow-sm block">
                                  <img src={link.megaMenu!.exclusiveDesigns[0].image} alt="Explore" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#4a2e1b]/90 via-[#4a2e1b]/40 to-transparent flex items-end justify-center pb-8 pt-20">
                                    <span className="text-[#f5ecd5] font-display text-[22px] tracking-[0.15em] font-light uppercase opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all">{link.megaMenu!.exclusiveDesigns[0].label}</span>
                                  </div>
                               </Link>
                            )}
                          </div>
                        </>
                      )}

                      {/* LAYOUT 3: DEFAULT (Rings, Earrings, Bangles, Necklaces, etc) */}
                      {!isKids && !isMensOrCollections && !isCollectionsList && !isMoreJewellery && (
                        <>
                          <div className="col-span-12 md:col-span-7 lg:col-span-7 xl:col-span-8 flex justify-between pr-4 xl:pr-8">
                            {/* Column 1 & 2: By Popular Style */}
                            {link.megaMenu!.styles && (
                              <div className="w-[42%] pr-2">
                                <h3 className={headerClass}>
                                  By Popular Style
                                </h3>
                                <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                                  {link.megaMenu!.styles.map((item) => (
                                    <li key={item.label}>
                                      <Link to={item.href} className={liClass}>
                                        {item.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Column 3: By Price Range */}
                            {link.megaMenu!.prices && (
                              <div className="w-[30%] px-2">
                                <h3 className={headerClass}>
                                  By Price Range
                                </h3>
                                <ul className="flex flex-col gap-y-2.5">
                                  {link.megaMenu!.prices.map((item) => (
                                    <li key={item.label}>
                                      <Link to={item.href} className={liClass}>
                                        {item.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Column 4: By Karat & Shop For */}
                            <div className="w-[28%] pl-2">
                              {link.megaMenu!.karats && link.megaMenu!.karats.length > 0 && (
                                <>
                                  <h3 className={headerClass}>
                                    By Karat
                                  </h3>
                                  <ul className="flex flex-col gap-y-2.5 mb-6">
                                    {link.megaMenu!.karats.map((item) => (
                                      <li key={item.label}>
                                        <Link to={item.href} className={liClass}>
                                          {item.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}

                              {link.megaMenu!.shopFor && link.megaMenu!.shopFor.length > 0 && (
                                <>
                                  <h3 className={headerClass}>
                                    Shop For
                                  </h3>
                                  <ul className="flex flex-col gap-y-2.5">
                                    {link.megaMenu!.shopFor.map((item) => (
                                      <li key={item.label}>
                                        <Link to={item.href} className={liClass}>
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
                          <div className="col-span-12 md:col-span-5 lg:col-span-5 xl:col-span-4 pl-4 xl:pl-6">
                             <h3 className={headerClass}>
                                Our Exclusive Designs
                             </h3>
                             <div className={`grid ${link.megaMenu!.exclusiveDesigns.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
                                {link.megaMenu!.exclusiveDesigns.map((design) => (
                                  <Link key={design.label} to={design.href} className="group flex flex-col rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow border border-border/40">
                                    <div className="aspect-square bg-[#ECE8E5] overflow-hidden">
                                       <img src={design.image} alt={design.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                    </div>
                                    <div className="w-full py-2.5 text-center px-1 bg-[#F3EFEA]">
                                      <span className="text-[12px] text-foreground font-body font-medium truncate w-full block">
                                        {design.label}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                             </div>
                          </div>
                        </>
                      )}

                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default DesktopNav;
