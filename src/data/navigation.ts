export interface NavItem {
  label: string;
  href: string;
  icon?: string; // Support for round image icons in lists
}

export interface ExclusiveDesign {
  label: string;
  image: string;
  href: string;
  large?: boolean; // Support for large singular promotional cards
}

export interface MegaMenuData {
  stylesTitle?: string; // E.g., "Shop For Men"
  styles?: NavItem[];
  prices?: NavItem[];
  karats?: NavItem[];
  shopFor?: NavItem[];
  exclusiveDesigns?: ExclusiveDesign[]; // Make this optional since Collections won't have it
}

export interface MainNavItem extends NavItem {
  megaMenu?: MegaMenuData;
}

const productLink = (cat: string, param?: string, value?: string) => {
  return `/products?category=${cat}${param && value ? `&${param}=${value}` : ""}`;
};

export const navigationData: MainNavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Rings",
    href: "/products?category=rings",
    megaMenu: {
      styles: [
        { label: "Engagement", href: productLink("rings", "style", "engagement") },
        { label: "Bands", href: productLink("rings", "style", "bands") },
        { label: "Antique", href: productLink("rings", "style", "antique") },
        { label: "Monzonaite", href: productLink("rings", "style", "monzonaite") },
        { label: "Real Diamond", href: productLink("rings", "style", "real-diamond") },
        { label: "Pearl", href: productLink("rings", "style", "pearl") },
        { label: "Baguette", href: productLink("rings", "style", "baguette") },
        { label: "Enamel", href: productLink("rings", "style", "enamel") },
        { label: "Solitaire", href: productLink("rings", "style", "solitaire") },
        { label: "Promise Rings", href: productLink("rings", "style", "promise-rings") },
        { label: "Polki", href: productLink("rings", "style", "polki") },
        { label: "Gemstone", href: productLink("rings", "style", "gemstone") },
        { label: "Victorian", href: productLink("rings", "style", "victorian") },
        { label: "Plain", href: productLink("rings", "style", "plain") },
        { label: "Double Finger", href: productLink("rings", "style", "double-finger") },
        { label: "Premium Elite", href: productLink("rings", "style", "premium-elite") },
      ],
      prices: [
        { label: "Under ₹25,000", href: productLink("rings", "price", "under-25000") },
        { label: "₹25,001 - ₹50,000", href: productLink("rings", "price", "25001-50000") },
        { label: "₹50,001 - ₹75,000", href: productLink("rings", "price", "50001-75000") },
        { label: "₹75,001 - ₹1,00,000", href: productLink("rings", "price", "75001-100000") },
        { label: "₹1,00,001 - ₹1,50,000", href: productLink("rings", "price", "100001-150000") },
        { label: "₹1,50,001 - ₹2,00,000", href: productLink("rings", "price", "150001-200000") },
        { label: "₹2,00,001 - ₹3,00,000", href: productLink("rings", "price", "200001-300000") },
        { label: "₹3,00,001 - ₹5,00,000", href: productLink("rings", "price", "300001-500000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("rings", "karat", "22") },
        { label: "18 Karat", href: productLink("rings", "karat", "18") },
        { label: "14 Karat", href: productLink("rings", "karat", "14") },
      ],
      shopFor: [
        { label: "Men", href: productLink("rings", "for", "men") },
        { label: "Women", href: productLink("rings", "for", "women") },
        { label: "Couple", href: productLink("rings", "for", "couple") },
      ],
      exclusiveDesigns: [
        { label: "Daily Wear", image: "/category-images/1767252568609-daily-wear.jpg", href: productLink("rings", "collection", "daily-wear") },
        { label: "Cocktail", image: "https://api.rushabhjewel.com/img/2026/1/1/7/1767252664187-cocktail.jpg", href: productLink("rings", "collection", "cocktail") },
        { label: "Heritage", image: "https://api.rushabhjewel.com/img/2026/1/1/7/1767252592142-heritage.jpg", href: productLink("rings", "collection", "heritage") },
      ]
    }
  },
  {
    label: "Earrings",
    href: "/products?category=earrings",
    megaMenu: {
      styles: [
        { label: "Studs", href: productLink("earrings", "style", "studs") },
        { label: "Drops", href: productLink("earrings", "style", "drops") },
        { label: "Hoops", href: productLink("earrings", "style", "hoops") },
        { label: "Jhumkas", href: productLink("earrings", "style", "jhumkas") },
        { label: "Chandbalis", href: productLink("earrings", "style", "chandbalis") },
        { label: "Sui Dhaga", href: productLink("earrings", "style", "sui-dhaga") },
        { label: "Ear Cuffs", href: productLink("earrings", "style", "ear-cuffs") },
        { label: "Huggie", href: productLink("earrings", "style", "huggie") },
      ],
      prices: [
        { label: "Under ₹25,000", href: productLink("earrings", "price", "under-25000") },
        { label: "₹25,001 - ₹50,000", href: productLink("earrings", "price", "25001-50000") },
        { label: "₹50,001 - ₹75,000", href: productLink("earrings", "price", "50001-75000") },
        { label: "₹75,001 - ₹1,00,000", href: productLink("earrings", "price", "75001-100000") },
        { label: "₹1,00,001 - ₹1,50,000", href: productLink("earrings", "price", "100001-150000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("earrings", "karat", "22") },
        { label: "18 Karat", href: productLink("earrings", "karat", "18") },
      ],
      shopFor: [
        { label: "Women", href: productLink("earrings", "for", "women") },
        { label: "Kids", href: productLink("earrings", "for", "kids") },
      ],
      exclusiveDesigns: [
        { label: "Studs", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257724851-studs.jpg", href: productLink("earrings", "collection", "studs") },
        { label: "Polki", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257806131-polki.jpg", href: productLink("earrings", "collection", "polki") },
        { label: "Real Diamond", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257707173-real-diamond.jpg", href: productLink("earrings", "collection", "real-diamond") },
      ]
    }
  },
  {
    label: "Bangles",
    href: "/products?category=bangles",
    megaMenu: {
      styles: [
        { label: "Heritage", href: productLink("bangles", "style", "heritage") },
        { label: "Daily Wear", href: productLink("bangles", "style", "daily-wear") },
        { label: "Italian", href: productLink("bangles", "style", "italian") },
        { label: "Premium Elite", href: productLink("bangles", "style", "premium-elite") },
      ],
      prices: [
        { label: "₹3,00,001 - ₹5,00,000", href: productLink("bangles", "price", "300001-500000") },
        { label: "Above ₹5,00,000", href: productLink("bangles", "price", "above-500000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("bangles", "karat", "22") },
        { label: "18 Karat", href: productLink("bangles", "karat", "18") },
      ],
      shopFor: [
        { label: "Women", href: productLink("bangles", "for", "women") },
      ],
      exclusiveDesigns: [
        { label: "Antique", image: "https://api.rushabhjewel.com/img/2026/1/1/7/1767252836991-antique-bangles.jpg", href: productLink("bangles", "collection", "antique") },
        { label: "Light Weight", image: "https://api.rushabhjewel.com/img/2026/1/22/1/1769066362195-bn18-13-1.jpg", href: productLink("bangles", "collection", "light-weight") },
      ]
    }
  },
  {
    label: "Pendant Set",
    href: "/products?category=pendant-set",
    megaMenu: {
      styles: [
        { label: "Heart", href: productLink("pendant-set", "style", "heart") },
        { label: "Antique", href: productLink("pendant-set", "style", "antique") },
        { label: "Polki", href: productLink("pendant-set", "style", "polki") },
        { label: "Italian", href: productLink("pendant-set", "style", "italian") },
        { label: "Real Diamond", href: productLink("pendant-set", "style", "real-diamond") },
        { label: "Pearl", href: productLink("pendant-set", "style", "pearl") },
        { label: "MOP", href: productLink("pendant-set", "style", "mop") },
        { label: "Heritage", href: productLink("pendant-set", "style", "heritage") },
        { label: "Monzonaite", href: productLink("pendant-set", "style", "monzonaite") },
        { label: "Gemstone", href: productLink("pendant-set", "style", "gemstone") },
        { label: "Victorian", href: productLink("pendant-set", "style", "victorian") },
        { label: "Plain", href: productLink("pendant-set", "style", "plain") },
      ],
      prices: [
        { label: "Under ₹25,000", href: productLink("pendant-set", "price", "under-25000") },
        { label: "₹25,001 - ₹50,000", href: productLink("pendant-set", "price", "25001-50000") },
        { label: "₹50,001 - ₹75,000", href: productLink("pendant-set", "price", "50001-75000") },
        { label: "₹75,001 - ₹1,00,000", href: productLink("pendant-set", "price", "75001-100000") },
        { label: "₹1,00,001 - ₹1,50,000", href: productLink("pendant-set", "price", "100001-150000") },
        { label: "₹1,50,001 - ₹2,00,000", href: productLink("pendant-set", "price", "150001-200000") },
        { label: "Above ₹5,00,000", href: productLink("pendant-set", "price", "above-500000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("pendant-set", "karat", "22") },
        { label: "18 Karat", href: productLink("pendant-set", "karat", "18") },
      ],
      shopFor: [
        { label: "Women", href: productLink("pendant-set", "for", "women") },
      ],
      exclusiveDesigns: [
        { label: "Antique", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767261944933-antique.jpg", href: productLink("pendant-set", "collection", "antique") },
        { label: "Heritage", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767261955406-heritage.jpg", href: productLink("pendant-set", "collection", "heritage") },
        { label: "Monzonaite", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767261966549-monzonaite.jpg", href: productLink("pendant-set", "collection", "monzonaite") },
      ]
    }
  },
  {
    label: "Mangalsutra",
    href: "/products?category=mangalsutra",
    megaMenu: {
      styles: [
        { label: "Daily Wear", href: productLink("mangalsutra", "style", "daily-wear") },
        { label: "Monzonaite Chain Set", href: productLink("mangalsutra", "style", "monzonaite-chain-set") },
        { label: "Omega", href: productLink("mangalsutra", "style", "omega") },
        { label: "Plain", href: productLink("mangalsutra", "style", "plain") },
        { label: "Mala", href: productLink("mangalsutra", "style", "mala") },
        { label: "Chain Pendent Set", href: productLink("mangalsutra", "style", "chain-pendent-set") },
        { label: "Layered", href: productLink("mangalsutra", "style", "layered") },
        { label: "Chain With Pendent", href: productLink("mangalsutra", "style", "chain-with-pendent") },
        { label: "Pearl", href: productLink("mangalsutra", "style", "pearl") },
        { label: "Evil Eye", href: productLink("mangalsutra", "style", "evil-eye") },
        { label: "Premium Elite", href: productLink("mangalsutra", "style", "premium-elite") },
      ],
      prices: [
        { label: "₹25,001 - ₹50,000", href: productLink("mangalsutra", "price", "25001-50000") },
        { label: "₹50,001 - ₹75,000", href: productLink("mangalsutra", "price", "50001-75000") },
        { label: "₹75,001 - ₹1,00,000", href: productLink("mangalsutra", "price", "75001-100000") },
        { label: "₹1,00,001 - ₹1,50,000", href: productLink("mangalsutra", "price", "100001-150000") },
        { label: "₹1,50,001 - ₹2,00,000", href: productLink("mangalsutra", "price", "150001-200000") },
        { label: "₹2,00,001 - ₹3,00,000", href: productLink("mangalsutra", "price", "200001-300000") },
        { label: "₹3,00,001 - ₹5,00,000", href: productLink("mangalsutra", "price", "300001-500000") },
        { label: "Above ₹5,00,000", href: productLink("mangalsutra", "price", "above-500000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("mangalsutra", "karat", "22") },
        { label: "18 Karat", href: productLink("mangalsutra", "karat", "18") },
      ],
      shopFor: [
        { label: "Men", href: productLink("mangalsutra", "for", "men") },
        { label: "Women", href: productLink("mangalsutra", "for", "women") },
      ],
      exclusiveDesigns: [
        { label: "Tanmaniya or charms", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257347559-tanmaniya-or-charms.jpg", href: productLink("mangalsutra", "collection", "tanmaniya") },
        { label: "Antique chain with P.Set", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257440258-antique-chain-with-p.set.jpg", href: productLink("mangalsutra", "collection", "antique") },
        { label: "Italian", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257479337-italian.jpg", href: productLink("mangalsutra", "collection", "italian") },
      ]
    }
  },
  {
    label: "Necklace",
    href: "/products?category=necklace",
    megaMenu: {
      styles: [
        { label: "Polki", href: productLink("necklace", "style", "polki") },
        { label: "Gemstone", href: productLink("necklace", "style", "gemstone") },
        { label: "Victorian", href: productLink("necklace", "style", "victorian") },
        { label: "Collar", href: productLink("necklace", "style", "collar") },
        { label: "Zalar", href: productLink("necklace", "style", "zalar") },
        { label: "MOP", href: productLink("necklace", "style", "mop") },
        { label: "Italian", href: productLink("necklace", "style", "italian") },
        { label: "Real Diamond", href: productLink("necklace", "style", "real-diamond") },
        { label: "Long", href: productLink("necklace", "style", "long") },
        { label: "Kantha", href: productLink("necklace", "style", "kantha") },
        { label: "Premium Elite", href: productLink("necklace", "style", "premium-elite") },
      ],
      prices: [
        { label: "₹1,00,001 - ₹1,50,000", href: productLink("necklace", "price", "100001-150000") },
        { label: "₹1,50,001 - ₹2,00,000", href: productLink("necklace", "price", "150001-200000") },
        { label: "₹2,00,001 - ₹3,00,000", href: productLink("necklace", "price", "200001-300000") },
        { label: "₹3,00,001 - ₹5,00,000", href: productLink("necklace", "price", "300001-500000") },
        { label: "Above ₹5,00,000", href: productLink("necklace", "price", "above-500000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("necklace", "karat", "22") },
        { label: "18 Karat", href: productLink("necklace", "karat", "18") },
      ],
      exclusiveDesigns: [
        { label: "Polki", image: "https://api.rushabhjewel.com/img/2025/10/18/15/1760782642206-nksn18-8619-1.jpg", href: productLink("necklace", "collection", "polki") },
        { label: "Victorian", image: "https://api.rushabhjewel.com/img/2025/10/7/15/1759829748518-an22-275-1.jpg", href: productLink("necklace", "collection", "victorian") },
        { label: "Real Diamond", image: "https://api.rushabhjewel.com/img/2025/10/18/15/1760782874703-nksn22-11770-1.jpg", href: productLink("necklace", "collection", "real-diamond") },
      ]
    }
  },
  {
    label: "Chains",
    href: "/products?category=chains",
    megaMenu: {
      styles: [
        { label: "Daily Wear", href: productLink("chains", "style", "daily-wear") },
        { label: "Monzonaite Chain Set", href: productLink("chains", "style", "monzonaite-chain-set") },
        { label: "Omega", href: productLink("chains", "style", "omega") },
        { label: "Plain", href: productLink("chains", "style", "plain") },
        { label: "Mala", href: productLink("chains", "style", "mala") },
        { label: "Chain Pendent Set", href: productLink("chains", "style", "chain-pendent-set") },
        { label: "Layered", href: productLink("chains", "style", "layered") },
        { label: "Chain With Pendent", href: productLink("chains", "style", "chain-with-pendent") },
        { label: "Pearl", href: productLink("chains", "style", "pearl") },
        { label: "Evil Eye", href: productLink("chains", "style", "evil-eye") },
        { label: "Premium Elite", href: productLink("chains", "style", "premium-elite") },
      ],
      prices: [
        { label: "₹25,001 - ₹50,000", href: productLink("chains", "price", "25001-50000") },
        { label: "₹50,001 - ₹75,000", href: productLink("chains", "price", "50001-75000") },
        { label: "₹75,001 - ₹1,00,000", href: productLink("chains", "price", "75001-100000") },
        { label: "₹1,00,001 - ₹1,50,000", href: productLink("chains", "price", "100001-150000") },
        { label: "₹1,50,001 - ₹2,00,000", href: productLink("chains", "price", "150001-200000") },
        { label: "₹2,00,001 - ₹3,00,000", href: productLink("chains", "price", "200001-300000") },
        { label: "₹3,00,001 - ₹5,00,000", href: productLink("chains", "price", "300001-500000") },
        { label: "Above ₹5,00,000", href: productLink("chains", "price", "above-500000") },
      ],
      karats: [
        { label: "22 Karat", href: productLink("chains", "karat", "22") },
        { label: "18 Karat", href: productLink("chains", "karat", "18") },
      ],
      shopFor: [
        { label: "Men", href: productLink("chains", "for", "men") },
        { label: "Women", href: productLink("chains", "for", "women") },
      ],
      exclusiveDesigns: [
        { label: "Tanmaniya or charms", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257347559-tanmaniya-or-charms.jpg", href: productLink("chains", "collection", "tanmaniya") },
        { label: "Antique chain with P.Set", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257440258-antique-chain-with-p.set.jpg", href: productLink("chains", "collection", "antique") },
        { label: "Italian", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767257479337-italian.jpg", href: productLink("chains", "collection", "italian") },
      ]
    }
  },
  {
    label: "Kids Collections",
    href: "/products?category=kids-collections",
    megaMenu: {
      // Only cards here!
      exclusiveDesigns: [
        { label: "Baby Nazariya", image: "/category-images/1760872944293-tp18-42608-1.jpg", href: productLink("kids-collections", "type", "nazariya") },
        { label: "Baby Kadli", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767267160912-baby-kadli.jpg", href: productLink("kids-collections", "type", "kadli") },
        { label: "Baby Pendent", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767267171887-baby-pendent.jpg", href: productLink("kids-collections", "type", "pendent") },
      ]
    }
  },
  {
    label: "Mens Jewellery",
    href: "/products?category=mens-jewellery",
    megaMenu: {
      stylesTitle: "Shop For Men",
      styles: [
        { label: "Leather Kada", href: productLink("mens-jewellery", "style", "leather-kada") },
        { label: "Punjabi Kada", href: productLink("mens-jewellery", "style", "punjabi-kada") },
        { label: "Solitaire", href: productLink("mens-jewellery", "style", "solitaire") },
        { label: "Premium Elite", href: productLink("mens-jewellery", "style", "premium-elite") },
        { label: "Bands", href: productLink("mens-jewellery", "style", "bands") },
        { label: "Rings", href: productLink("mens-jewellery", "style", "rings") },
        { label: "Real Diamond", href: productLink("mens-jewellery", "style", "real-diamond") },
      ],
      exclusiveDesigns: [
        { label: "Rings", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767268593414-ring.jpg", href: productLink("mens-jewellery", "type", "rings") },
        { label: "Bracelets & Bangles", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767268605175-bracelet-and-bangle.jpg", href: productLink("mens-jewellery", "type", "bracelets") },
        { label: "Chains", image: "https://api.rushabhjewel.com/img/2026/1/1/8/1767268615392-chains.jpg", href: productLink("mens-jewellery", "type", "chains") },
      ]
    }
  },
  {
    label: "Collections",
    href: "/products?category=collections",
    megaMenu: {
      styles: [
        { label: "Heritage Virasat", href: productLink("collections", "sub", "heritage-virasat") },
        { label: "Bridal Dreams", href: productLink("collections", "sub", "bridal-dreams") },
        { label: "Heart Harmony", href: productLink("collections", "sub", "heart-harmony") },
        { label: "Pearl Prestige", href: productLink("collections", "sub", "pearl-prestige") },
        { label: "Mother of Pearl Essence", href: productLink("collections", "sub", "mother-of-pearl-essence") },
        { label: "Enamel Imperial", href: productLink("collections", "sub", "enamel-imperial") },
        { label: "Antique Parampara", href: productLink("collections", "sub", "antique-parampara") },
        { label: "Premium Elite", href: productLink("collections", "sub", "premium-elite") },
        { label: "Italian Era", href: productLink("collections", "sub", "italian-era") },
        { label: "Monzonaite Shine", href: productLink("collections", "sub", "monzonaite-shine") },
        { label: "Baby Bloom", href: productLink("collections", "sub", "baby-bloom") },
        { label: "Victorian Majesty", href: productLink("collections", "sub", "victorian-majesty") },
        { label: "Peacock Jewel", href: productLink("collections", "sub", "peacock-jewel") },
        { label: "Limited Luxe", href: productLink("collections", "sub", "limited-luxe") },
        { label: "Gemstone Radiance", href: productLink("collections", "sub", "gemstone-radiance") },
        { label: "Real Diamond Signature", href: productLink("collections", "sub", "real-diamond-signature") },
        { label: "Real Polki Riyasat", href: productLink("collections", "sub", "real-polki-riyasat") },
        { label: "Light Weight Charm", href: productLink("collections", "sub", "light-weight-charm") },
        { label: "Everyday Gleam", href: productLink("collections", "sub", "everyday-gleam") }
      ]
    }
  },
  {
    label: "More Jewellery",
    href: "/products?category=more-jewellery",
    megaMenu: {
      stylesTitle: "",
      styles: [
        { label: "Hath Panja", icon: "https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "hath-panja") },
        { label: "Mang Tika", icon: "https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "mang-tika") },
        { label: "Watch", icon: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "watch") },
        { label: "Pendants", icon: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "pendants") },
        { label: "Kada", icon: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "kada") },
        { label: "Gajara", icon: "https://images.unsplash.com/photo-1599643478514-4a4e03164917?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "gajara") },
        { label: "Kanser", icon: "https://images.unsplash.com/photo-1605100804763-247f66121411?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "kanser") },
        { label: "Letter Pendant", icon: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=50&h=50", href: productLink("more-jewellery", "style", "letter-pendant") },
      ],
      exclusiveDesigns: [
        { label: "EXPLORE ALL", image: "https://www.rushabhjewel.com/_next/image?url=%2Fsiteassets%2Fimages%2Fbanner%2Fmorejewellery.png&w=3840&q=75", href: "/products?category=more-jewellery", large: true },
      ]
    }
  },
];
