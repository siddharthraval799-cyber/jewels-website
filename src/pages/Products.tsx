import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ChevronDown, ChevronRight, X, Loader2, Filter, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";
import { useGoldRates } from "@/contexts/GoldRateContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

// Static definitions
const sortOptions = [
  { label: "Best Matches", value: "best" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Weight: Light to Heavy", value: "weight-asc" },
];

const priceRanges = [
  { label: "₹25,001 - ₹50,000", min: 25001, max: 50000 },
  { label: "₹50,001 - ₹75,000", min: 50001, max: 75000 },
  { label: "₹75,001 - ₹1,00,000", min: 75001, max: 100000 },
  { label: "₹1,00,001 - ₹1,50,000", min: 100001, max: 150000 },
  { label: "₹1,50,001 - ₹2,00,000", min: 150001, max: 200000 },
  { label: "Above ₹2,00,000", min: 200001, max: Infinity },
];

const weightRanges = [
  { label: "2-5 gm", min: 2, max: 5 },
  { label: "5-10 gm", min: 5, max: 10 },
  { label: "10-15 gm", min: 10, max: 15 },
  { label: "15-20 gm", min: 15, max: 20 },
  { label: "20-25 gm", min: 20, max: 25 },
  { label: "Above 25 gm", min: 25.01, max: Infinity },
];

// Helper to determine calculated price (re-implemented from static data file)
const getPrice = (p: Product, goldRate: number) => {
  const goldValue = p.weight * goldRate;
  return goldValue + p.makingCharges;
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [sort, setSort] = useState("best");
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({});
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [exploreProduct, setExploreProduct] = useState<Product | null>(null);
  
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { rates } = useGoldRates();

  useEffect(() => {
    setLoading(true);
    api.products.list(activeCategory ? { category: activeCategory } : undefined)
      .then(data => {
         setProducts(data.products || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  // Extract all unique dynamic attribute categories and their options
  const filterSpecs = useMemo(() => {
     const specs: Record<string, Set<string>> = {};
     products.forEach(p => {
        if (p.attributes) {
           Object.entries(p.attributes).forEach(([key, values]) => {
              if (!specs[key]) specs[key] = new Set();
              if (Array.isArray(values)) {
                 values.forEach(v => specs[key].add(v));
              }
           });
        }
     });

     // Convert sets to sorted arrays
     const finalSpecs: { name: string; options: { label: string; count: number }[] }[] = [];
     Object.entries(specs).forEach(([name, valSet]) => {
         const optionsArr = Array.from(valSet).map(label => {
            // Count how many products have this attribute value
            const count = products.filter(p => p.attributes?.[name]?.includes(label)).length;
            return { label, count };
         }).sort((a,b) => b.count - a.count); // sort by occurrence
         finalSpecs.push({ name, options: optionsArr });
     });
     
     // Put specific ones first matching the photos
     const preferredOrder = ["Design Types", "Collection", "Occasion", "Shop For", "Gifts", "Metal", "Color"];
     return finalSpecs.sort((a, b) => {
        const aIdx = preferredOrder.indexOf(a.name);
        const bIdx = preferredOrder.indexOf(b.name);
        if(aIdx === -1 && bIdx === -1) return a.name.localeCompare(b.name);
        if(aIdx === -1) return 1;
        if(bIdx === -1) return -1;
        return aIdx - bIdx;
     });
  }, [products]);

  // Handle active toggles
  const toggleAttribute = (key: string, value: string) => {
     setSelectedAttributes(prev => {
        const curr = prev[key] || [];
        if (curr.includes(value)) {
           const next = curr.filter(v => v !== value);
           return next.length > 0 ? { ...prev, [key]: next } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== key));
        } else {
           return { ...prev, [key]: [...curr, value] };
        }
     });
  };

  const togglePrice = (label: string) => {
     setSelectedPrices(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const toggleWeight = (label: string) => {
     setSelectedWeights(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const clearAll = () => {
     setSelectedAttributes({});
     setSelectedPrices([]);
     setSelectedWeights([]);
  };

  // Compute Active filter tags array for the top bar
  const activeTags = useMemo(() => {
     const tags: { id: string; label: string; type: string; catKey?: string }[] = [];
     Object.entries(selectedAttributes).forEach(([key, values]) => {
        values.forEach(v => tags.push({ id: `${key}-${v}`, label: v, type: 'attr', catKey: key }));
     });
     selectedPrices.forEach(p => tags.push({ id: `price-${p}`, label: p, type: 'price' }));
     selectedWeights.forEach(w => tags.push({ id: `weight-${w}`, label: w, type: 'weight' }));
     return tags;
  }, [selectedAttributes, selectedPrices, selectedWeights]);

  const removeTag = (tag: any) => {
      if(tag.type === 'attr') toggleAttribute(tag.catKey, tag.label);
      if(tag.type === 'price') togglePrice(tag.label);
      if(tag.type === 'weight') toggleWeight(tag.label);
  };

  // Perform filtering
  const filteredProducts = useMemo(() => {
     let result = [...products];

     // Attribute matching (OR within same category, AND across categories)
     Object.entries(selectedAttributes).forEach(([key, values]) => {
        if(values.length === 0) return;
        result = result.filter(p => {
           if (!p.attributes || !p.attributes[key]) return false;
           // Using some means if they pick "Yellow" and "White", they see items that have either
           return values.some(v => (p.attributes![key] as string[]).includes(v));
        });
     });

     // Price Range matching
     if (selectedPrices.length > 0) {
        result = result.filter(p => {
           const price = getPrice(p, rates.gold22k);
           return selectedPrices.some(label => {
              const range = priceRanges.find(r => r.label === label);
              return range && price >= range.min && price <= range.max;
           });
        });
     }

     // Weight matching
     if (selectedWeights.length > 0) {
        result = result.filter(p => {
           return selectedWeights.some(label => {
              const range = weightRanges.find(r => r.label === label);
              return range && p.weight >= range.min && p.weight <= range.max;
           });
        });
     }

     // Sorting
     switch (sort) {
       case "newest":
         result.sort((a,b) => new Date(b.created_at||0).getTime() - new Date(a.created_at||0).getTime());
         break;
       case "price-asc":
         result.sort((a,b) => getPrice(a, rates.gold22k) - getPrice(b, rates.gold22k));
         break;
       case "price-desc":
         result.sort((a,b) => getPrice(b, rates.gold22k) - getPrice(a, rates.gold22k));
         break;
       case "weight-asc":
         result.sort((a,b) => a.weight - b.weight);
         break;
     }

     return result;
  }, [products, selectedAttributes, selectedPrices, selectedWeights, sort, rates.gold22k]);

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24">
      <Header />
      <CartDrawer />

      {/* Breadcrumb matching layout */}
      <div className="border-b border-border/40 py-3 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-primary transition-colors">Shop</Link>
            {activeCategory && (
               <>
                 <ChevronRight className="w-3 h-3" />
                 <span className="text-secondary-foreground font-medium capitalize border-b border-secondary-foreground pb-0.5">{activeCategory}</span>
               </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
         
         {/* Mobile Filter Button */}
         <div className="md:hidden flex justify-between items-center mb-4">
             <button onClick={() => setMobileFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-semibold">
                <Filter className="w-4 h-4" /> Filters
             </button>
             <span className="font-medium text-sm">{filteredProducts.length} Results</span>
         </div>

         {/* Left Sidebar Filter Container */}
         <div className={`fixed inset-0 z-50 bg-white md:bg-transparent md:static md:block md:w-64 lg:w-72 md:shrink-0 ${mobileFilterOpen ? 'block overflow-y-auto w-full p-4' : 'hidden'}`}>
             
             <div className="flex items-center justify-between mb-8">
                 <h2 className="font-display text-lg tracking-widest font-semibold flex items-center gap-2">
                    FILTERS <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">{activeTags.length}</span>
                 </h2>
                 {activeTags.length > 0 && (
                     <button onClick={clearAll} className="text-primary text-xs font-bold hover:underline tracking-wider uppercase">
                         CLEAR ALL
                     </button>
                 )}
                 <button className="md:hidden" onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5"/></button>
             </div>

             <div className="space-y-8 pr-4">
                {/* Dynamically mapped attributes (Design Types, Collection, etc) */}
                {filterSpecs.map((spec) => (
                   <div key={spec.name} className="border-b border-border/40 pb-6">
                       <h3 className="font-medium text-sm uppercase tracking-wider mb-4 flex justify-between items-center">
                          {spec.name.toUpperCase()}
                       </h3>
                       <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
                          {spec.options.map((opt) => (
                             <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                   <input 
                                     type="checkbox" 
                                     checked={selectedAttributes[spec.name]?.includes(opt.label) || false}
                                     onChange={() => toggleAttribute(spec.name, opt.label)}
                                     className="appearance-none w-4 h-4 rounded-sm border border-muted-foreground/40 checked:bg-primary checked:border-primary transition-colors peer cursor-pointer"
                                   />
                                   <ChevronDown className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                </div>
                                <span className={`text-sm font-body ${selectedAttributes[spec.name]?.includes(opt.label) ? 'text-secondary-foreground font-medium' : 'text-muted-foreground'} group-hover:text-secondary-foreground transition-colors`}>
                                   {opt.label} <span className="text-[10px] text-muted-foreground/60 ml-1">({opt.count})</span>
                                </span>
                             </label>
                          ))}
                       </div>
                   </div>
                ))}

                {/* Price Ranges Pre-defined block */}
                <div className="border-b border-border/40 pb-6">
                    <h3 className="font-medium text-sm uppercase tracking-wider mb-4">PRICE RANGES</h3>
                    <div className="space-y-3">
                       {priceRanges.map(range => (
                          <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={selectedPrices.includes(range.label)}
                                  onChange={() => togglePrice(range.label)}
                                  className="appearance-none w-4 h-4 rounded-sm border border-muted-foreground/40 checked:bg-primary checked:border-primary transition-colors peer cursor-pointer"
                                />
                                <ChevronDown className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                             </div>
                             <span className="text-sm font-body text-muted-foreground group-hover:text-secondary-foreground transition-colors">
                                {range.label}
                             </span>
                          </label>
                       ))}
                    </div>
                </div>

                {/* Weight Ranges Pre-defined block */}
                <div className="pb-6">
                    <h3 className="font-medium text-sm uppercase tracking-wider mb-4">WEIGHT RANGES</h3>
                    <div className="space-y-3">
                       {weightRanges.map(range => (
                          <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                             <div className="relative flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={selectedWeights.includes(range.label)}
                                  onChange={() => toggleWeight(range.label)}
                                  className="appearance-none w-4 h-4 rounded-sm border border-muted-foreground/40 checked:bg-primary checked:border-primary transition-colors peer cursor-pointer"
                                />
                                <ChevronDown className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none" />
                             </div>
                             <span className="text-sm font-body text-muted-foreground group-hover:text-secondary-foreground transition-colors">
                                {range.label}
                             </span>
                          </label>
                       ))}
                    </div>
                </div>

             </div>
         </div>

         {/* Right Layout: Tags & Grid */}
         <div className="flex-1 w-full flex flex-col">
            
            {/* Top Row: Tags and Sort */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                   {activeTags.length === 0 && !loading && (
                      <span className="text-xs text-muted-foreground">Showing {filteredProducts.length} Results</span>
                   )}
                   {activeTags.map(tag => (
                      <span key={tag.id} className="bg-cream border border-border px-3 py-1.5 rounded text-[11px] font-body text-secondary-foreground flex items-center gap-2 whitespace-nowrap">
                          {tag.label} 
                          <button onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-primary"><X className="w-3 h-3" /></button>
                      </span>
                   ))}
                </div>

                <div className="flex items-center gap-3 min-w-max self-end md:self-auto">
                   <span className="text-xs text-muted-foreground font-medium hidden lg:inline">Sort By :</span>
                   <div className="relative">
                      <select 
                        value={sort} 
                        onChange={e => setSort(e.target.value)}
                        className="appearance-none bg-transparent border-none pr-6 outline-none text-sm font-medium font-body text-secondary-foreground cursor-pointer"
                      >
                         {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                   </div>
                </div>
            </div>

            {/* Product Grid Area */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : filteredProducts.length > 0 ? (
                <>
                  {exploreProduct ? (
                     <div className="w-full bg-cream rounded-2xl p-6 md:p-8 border border-border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-border/50">
                           <div>
                              <h3 className="font-display text-xl md:text-2xl text-secondary-foreground flex items-center gap-2">
                                 <Sparkles className="w-5 h-5 text-primary" /> Similar Designs
                              </h3>
                              <p className="text-sm font-body text-muted-foreground mt-1">
                                 Based on <span className="font-semibold text-secondary-foreground">"{exploreProduct.name}"</span>
                              </p>
                           </div>
                           <button 
                             onClick={() => setExploreProduct(null)} 
                             className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-secondary-foreground hover:text-primary transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-border"
                           >
                              <X className="w-4 h-4" /> Close
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 gap-y-10">
                           {/* Filter for similar category and exclude the exactly clicked one */}
                           {filteredProducts
                             .filter(p => p.id !== exploreProduct.id && p.category === exploreProduct.category)
                             .slice(0, 8)
                             .map((p, i) => (
                              <ProductCard key={p.id} product={p as any} index={i} onExplore={(prod) => setExploreProduct(prod as any)} />
                           ))}
                           {filteredProducts.filter(p => p.id !== exploreProduct.id && p.category === exploreProduct.category).length === 0 && (
                             <div className="col-span-full py-12 text-center text-muted-foreground font-body">
                               No other similar designs found in your current filtered results.
                             </div>
                           )}
                        </div>
                     </div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-x-6 gap-y-10 w-full mb-12">
                       {filteredProducts.map((p, i) => (
                          <ProductCard key={p.id} product={p as any} index={i} onExplore={(prod) => setExploreProduct(prod as any)} />
                       ))}
                    </div>
                  )}
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 bg-cream/30 rounded-2xl border border-dashed border-border text-center px-4">
                    <Filter className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="font-display text-xl text-secondary-foreground font-semibold mb-2">No matching designs found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">We couldn't find any jewelry matching all your selected filters. Try removing some to see more results.</p>
                    <button onClick={clearAll} className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm">
                       Clear All Filters
                    </button>
                </div>
            )}
         </div>
         
      </div>

      <Footer />
    </div>
  );
};

export default Products;
