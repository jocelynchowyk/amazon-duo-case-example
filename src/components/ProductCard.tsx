import React, { useState } from 'react';
import { ChevronDown, Minus, Plus, Smartphone, Check } from 'lucide-react';
import { Product } from '../data/products';
import { PrimeBadge, StarRating } from './AmazonMarks';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  selectedVariantIdx: number;
  onSelectVariant: (idx: number) => void;
  onAddToCart: (product: Product, variantName: string, voucherApplied: boolean) => void;
  onUpdateQty: (productId: string, variantName: string, delta: number) => void;
  onOpenModal: (product: Product, variantIdx: number) => void;
  layoutMode: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  selectedVariantIdx,
  onSelectVariant,
  onAddToCart,
  onUpdateQty,
  onOpenModal,
  layoutMode,
}) => {
  const [imgError, setImgError] = useState(false);
  const [voucherChecked, setVoucherChecked] = useState(false);

  const activeVariant = product.variants[selectedVariantIdx] || product.variants[0];
  const effectivePrice =
    voucherChecked && product.voucherDiscountPct
      ? product.priceSGD * (1 - product.voucherDiscountPct / 100)
      : product.priceSGD;

  const wholePart = Math.floor(effectivePrice);
  const centsPart = Math.round((effectivePrice - wholePart) * 100)
    .toString()
    .padStart(2, '0');

  const discountPercent = product.listPriceSGD
    ? Math.round(((product.listPriceSGD - product.priceSGD) / product.listPriceSGD) * 100)
    : null;

  const isList = layoutMode === 'list';

  return (
    <article
      className={`border border-[#F0F2F2] bg-white rounded-[4px] flex ${
        isList ? 'flex-col sm:flex-row gap-4 p-4' : 'flex-col'
      } hover:border-[#D5D9D9] transition-colors duration-150 overflow-hidden`}
    >
      {/* Product Image Area */}
      <div
        className={`relative bg-[#F7F7F7] flex items-center justify-center overflow-hidden group cursor-pointer ${
          isList ? 'w-full sm:w-[220px] h-[220px] shrink-0 rounded-[3px]' : 'aspect-square w-full p-4'
        }`}
        onClick={() => onOpenModal(product, selectedVariantIdx)}
      >
        {/* Single subtle Amazon corner badge */}
        {product.badge && (
          <div
            className={`absolute top-0 left-0 z-10 px-2.5 py-1 text-[11px] font-semibold tracking-tight text-white ${
              product.badge === "Amazon's Choice"
                ? 'bg-[#232F3E]'
                : product.badge === 'Best Seller'
                ? 'bg-[#D14900]'
                : 'bg-[#CC0C39]'
            }`}
          >
            {product.badge === "Amazon's Choice" ? (
              <span>
                Amazon&apos;s <span className="text-[#FF9900]">Choice</span>
              </span>
            ) : (
              product.badge
            )}
          </div>
        )}

        {!imgError ? (
          <img
            src={activeVariant.image}
            alt={`${product.title} - ${activeVariant.name}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] text-[#565959] p-4 text-center">
            <Smartphone className="w-10 h-10 mb-2 text-[#888C8C]" />
            <span className="text-[12px] font-medium line-clamp-2">{product.brand} Duo Case</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className={`flex-1 flex flex-col justify-between ${isList ? 'py-1' : 'p-3.5'}`}>
        <div>
          {/* Color Swatches */}
          {product.variants.length > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              {product.variants.map((variant, idx) => {
                const selected = idx === selectedVariantIdx;
                return (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => onSelectVariant(idx)}
                    title={variant.name}
                    aria-label={`Select color ${variant.name}`}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      selected
                        ? 'ring-2 ring-offset-1 ring-[#007185] border-[#0F1111]'
                        : 'border-[#CCCCCC] hover:border-[#0F1111]'
                    }`}
                    style={{ backgroundColor: variant.hex }}
                  />
                );
              })}
              <span className="text-[11px] text-[#565959] ml-1 truncate">
                {activeVariant.name}
              </span>
            </div>
          )}

          {/* Sponsored subtle label */}
          {product.isSponsored && (
            <div className="text-[11px] text-[#565959] mb-0.5">Sponsored</div>
          )}

          {/* Title */}
          <h3 className="mb-1.5">
            <button
              type="button"
              onClick={() => onOpenModal(product, selectedVariantIdx)}
              className="text-left text-[14px] sm:text-[15px] leading-[1.35] font-normal text-[#0F1111] hover:text-[#C7511F] line-clamp-3 cursor-pointer"
            >
              {product.title}
            </button>
          </h3>

          {/* Rating & Bought Count */}
          <div className="flex items-center gap-1 mb-0.5">
            <button
              type="button"
              onClick={() => onOpenModal(product, selectedVariantIdx)}
              className="inline-flex items-center gap-0.5 group cursor-pointer"
            >
              <StarRating rating={product.rating} size="sm" />
              <ChevronDown className="w-3 h-3 text-[#565959]" />
            </button>
            <button
              type="button"
              onClick={() => onOpenModal(product, selectedVariantIdx)}
              className="text-[12px] text-[#007185] hover:text-[#C7511F] tabular-nums cursor-pointer"
            >
              {product.reviewCount.toLocaleString()}
            </button>
          </div>
          <div className="text-[12px] text-[#565959] mb-2">
            {product.boughtPastMonth} bought in past month
          </div>

          {/* Pricing */}
          <div className="mb-1.5">
            {product.badge === 'Limited time deal' && (
              <div className="text-[12px] font-bold text-[#CC0C39] mb-0.5">
                Limited time deal
              </div>
            )}
            <div className="flex items-baseline flex-wrap gap-x-2">
              <button
                type="button"
                onClick={() => onOpenModal(product, selectedVariantIdx)}
                className="inline-flex items-start text-[#0F1111] leading-none cursor-pointer tabular-nums"
              >
                <span className="text-[12px] font-normal mt-[2px]">S$</span>
                <span className="text-[24px] font-medium tracking-tight leading-none">
                  {wholePart}
                </span>
                <span className="text-[12px] font-normal mt-[2px]">{centsPart}</span>
              </button>

              {product.listPriceSGD && (
                <div className="text-[12px] text-[#565959] tabular-nums">
                  <span>List: </span>
                  <span className="line-through">S${product.listPriceSGD.toFixed(2)}</span>
                  {discountPercent && discountPercent > 0 && (
                    <span className="ml-1 text-[#0F1111]">({discountPercent}% off)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Voucher Toggle */}
          {product.voucherDiscountPct && (
            <label className="inline-flex items-center gap-1.5 mb-2 cursor-pointer select-none text-[12px]">
              <input
                type="checkbox"
                checked={voucherChecked}
                onChange={(e) => setVoucherChecked(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#007600] cursor-pointer"
              />
              <span className="bg-[#7FDA69] text-[#0F1111] font-semibold px-1.5 py-0.5 text-[11px] leading-none">
                Save {product.voucherDiscountPct}%
              </span>
              <span className="text-[#565959]">with voucher</span>
            </label>
          )}

          {/* Prime & Delivery */}
          <div className="text-[12px] leading-[1.4] text-[#0F1111] space-y-0.5 mb-3">
            {product.isPrime && (
              <div className="flex items-center gap-1.5">
                <PrimeBadge compact />
              </div>
            )}
            <div>
              <span>FREE delivery </span>
              <span className="font-bold">{product.deliveryDateText}</span>
              {product.freeShippingNote && (
                <span className="text-[#565959]">
                  {' '}
                  on S$40.00 of eligible items shipped by Amazon
                </span>
              )}
            </div>
            {product.stockNote !== 'In Stock' && (
              <div className="text-[#B12704] font-medium">{product.stockNote}</div>
            )}
          </div>
        </div>

        {/* Add to Cart / Quantity Stepper */}
        <div className="pt-1">
          {cartQuantity === 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(product, activeVariant.name, voucherChecked)}
              className="w-full sm:w-auto px-4 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] border border-[#FCD200] rounded-full text-[13px] font-medium text-[#0F1111] transition-colors cursor-pointer whitespace-nowrap"
            >
              Add to cart
            </button>
          ) : (
            <div className="inline-flex items-center gap-2">
              <div className="inline-flex items-center border border-[#D5D9D9] rounded-full bg-[#F0F2F2] overflow-hidden">
                <button
                  type="button"
                  onClick={() => onUpdateQty(product.id, activeVariant.name, -1)}
                  aria-label="Decrease quantity"
                  className="px-2.5 py-1 hover:bg-[#E3E6E6] text-[#0F1111] cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 text-[13px] font-bold text-[#0F1111] tabular-nums">
                  {cartQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQty(product.id, activeVariant.name, 1)}
                  aria-label="Increase quantity"
                  className="px-2.5 py-1 hover:bg-[#E3E6E6] text-[#0F1111] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#007600]">
                <Check className="w-3.5 h-3.5" />
                In Cart
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
