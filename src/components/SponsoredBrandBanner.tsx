import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { StarRating } from './AmazonMarks';

interface SponsoredBrandBannerProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterBySpigen: () => void;
}

export const SponsoredBrandBanner: React.FC<SponsoredBrandBannerProps> = ({
  products,
  onSelectProduct,
  onFilterBySpigen,
}) => {
  const featured = products.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section
      aria-label="Sponsored brand showcase"
      className="mb-5 border border-[#E7E7E7] rounded-[4px] bg-white overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Brand Spotlight */}
        <div className="lg:col-span-4 bg-[#F7F8F8] p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E7E7E7]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold tracking-tight text-[#0F1111]">
                SPIGEN SINGAPORE
              </span>
              <span className="text-[11px] text-[#565959]">Sponsored</span>
            </div>
            <h2 className="text-[18px] font-semibold leading-snug text-[#0F1111] mb-1.5">
              Engineered hinge &amp; MagFit armor for iPhone Duo
            </h2>
            <p className="text-[13px] text-[#565959] leading-relaxed">
              Precision dual-panel fit, UV-resistant clarity, and slim impact protection.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={onFilterBySpigen}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              <span>Shop Spigen Store</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 3 Product Tiles */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EEEEEE]">
          {featured.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectProduct(item)}
              className="p-3.5 text-left hover:bg-[#FAFAFA] transition-colors flex sm:flex-col items-center sm:items-stretch gap-3 cursor-pointer group"
            >
              <div className="w-20 h-20 sm:w-full sm:h-28 bg-[#F7F7F7] rounded-[3px] flex items-center justify-center p-2 shrink-0 overflow-hidden">
                <img
                  src={item.variants[0].image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="min-w-0 flex-1 flex flex-col justify-between">
                <p className="text-[13px] leading-[1.3] text-[#0F1111] group-hover:text-[#C7511F] line-clamp-2 mb-1.5">
                  {item.title}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <StarRating rating={item.rating} size="sm" />
                    <span className="text-[11px] text-[#007185] tabular-nums">
                      ({item.reviewCount.toLocaleString()})
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-[#0F1111] tabular-nums">
                    S${item.priceSGD.toFixed(2)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
