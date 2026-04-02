import { Link } from "react-router-dom";

export default function InDemandBanner() {
  return (
    <section className="w-full bg-white px-4 md:px-6 lg:px-8 py-3">
      {/* Banner is 1200×452 — keep that exact aspect ratio */}
      <Link
        to="/products?category=mangalsutra"
        className="block w-full rounded-2xl overflow-hidden relative"
        style={{ aspectRatio: "2100 / 600" }}
        aria-label="Shop In-Demand Favorites"
      >
        <img
          src="/-my-gem-websit/images/in-demand-banner.jpg"
          alt="IN-DEMAND FAVORITES – Loved by many, made for you."
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>
    </section>
  );
}
