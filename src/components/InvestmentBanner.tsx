import { Link } from "react-router-dom";

const InvestmentBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <Link to="/products" className="block w-full">
        <div className="relative h-[250px] md:h-[450px] w-full">
          {/* Background Image from Rushabh with burned-in text */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url('https://cdn.rushabhjewel.com/img/2025/12/25/5/1766641158654-11%2B1-monthly-plan-1200_575-1.jpg')`,
              backgroundPosition: 'center'
            }} 
          />
          
          {/* Responsive overlay fix if needed, but the original looks fine as a full banner */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>
    </section>
  );
};

export default InvestmentBanner;
