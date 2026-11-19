import React, { useState, useEffect } from 'react';
import { X, MapPin, ShieldCheck, Lock, Check } from 'lucide-react';
import { Product } from '../data/products';
import { PrimeBadge, StarRating } from './AmazonMarks';

interface ProductModalProps {
  product: Product | null;
  initialVariantIdx: number;
  postalCode: string;
  onClose: () => void;
  onAddToCart: (product: Product, variantName: string, qty: number) => void;
  onBuyNow: (product: Product, variantName: string, qty: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  initialVariantIdx,
  postalCode,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [variantIdx, setVariantIdx] = useState(initialVariantIdx);
  const [qty, setQty] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    setVariantIdx(initialVariantIdx);
    setQty(1);
    setAddedFeedback(false);
  }, [product, initialVariantIdx]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const activeVariant = product.variants[variantIdx] || product.variants[0];

  const handleAdd = () => {
    onAddToCart(product, activeVariant.name, qty);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] max-w-[980px] w-full shadow-2xl border border-[#D5D9D9] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#F0F2F2] border-b border-[#D5D9D9]">
          <div className="text-[12px] text-[#565959] truncate">
            <span>Electronics</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span>Mobile Phones &amp; Accessories</span>
            <span className="mx-1.5">&rsaquo;</span>
            <span className="text-[#0F1111] font-medium">{product.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded hover:bg-[#E3E6E6] text-[#0F1111] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Product Image */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="aspect-square bg-[#F7F7F7] rounded-[4px] border border-[#EEE] flex items-center justify-center p-6">
              <img
                src={activeVariant.image}
                alt={`${product.title} - ${activeVariant.name}`}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[12px] text-[#565959] px-1">
              <span>
                Brand: <strong className="text-[#007185]">{product.brand}</strong>
              </span>
              <span className="font-mono-tabular">ASIN: {product.asin}</span>
            </div>
          </div>

          {/* Middle: Specs & About */}
          <div className="md:col-span-4 space-y-3">
            <h2
              id="pdp-modal-title"
              className="text-[18px] leading-[1.35] font-medium text-[#0F1111]"
            >
              {product.title}
            </h2>

            <div className="flex items-center gap-2 pb-2 border-b border-[#E7E7E7]">
              <span className="text-[13px] font-medium text-[#0F1111] tabular-nums">
                {product.rating.toFixed(1)}
              </span>
              <StarRating rating={product.rating} size="sm" />
              <span className="text-[13px] text-[#007185] tabular-nums">
                {product.reviewCount.toLocaleString()} ratings
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-medium text-[#0F1111] tabular-nums">
                  S${product.priceSGD.toFixed(2)}
                </span>
                {product.listPriceSGD && (
                  <span className="text-[13px] text-[#565959] line-through tabular-nums">
                    S${product.listPriceSGD.toFixed(2)}
                  </span>
                )}
              </div>
              {product.isPrime && (
                <div className="flex items-center gap-2">
                  <PrimeBadge />
                  <span className="text-[12px] text-[#565959]">Free local SG returns</span>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="pt-1">
              <div className="text-[13px] mb-1.5">
                <span className="text-[#565959]">Colour: </span>
                <span className="font-bold text-[#0F1111]">{activeVariant.name}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setVariantIdx(idx)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border text-[12px] cursor-pointer ${
                      idx === variantIdx
                        ? 'border-[#E77600] ring-1 ring-[#E77600] bg-[#FEF8F2] font-semibold'
                        : 'border-[#D5D9D9] hover:border-[#0F1111]'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: v.hex }}
                    />
                    <span>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[12px] py-2 border-y border-[#E7E7E7]">
              <span className="text-[#565959]">Material</span>
              <span className="font-medium text-[#0F1111]">{product.material}</span>
              <span className="text-[#565959]">Weight</span>
              <span className="font-medium text-[#0F1111] tabular-nums">
                {product.weightGrams} g
              </span>
              <span className="text-[#565959]">Compatibility</span>
              <span className="font-medium text-[#0F1111]">iPhone Duo</span>
            </div>

            {/* About this item */}
            <div>
              <h3 className="text-[14px] font-bold text-[#0F1111] mb-1.5">
                About this item
              </h3>
              <ul className="list-disc pl-4 space-y-1.5 text-[13px] text-[#0F1111] leading-[1.45]">
                {product.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="md:col-span-3">
            <div className="border border-[#D5D9D9] rounded-[8px] p-4 space-y-3 bg-white">
              <div className="text-[22px] font-medium text-[#0F1111] tabular-nums">
                S${product.priceSGD.toFixed(2)}
              </div>

              <div className="text-[13px] leading-snug">
                {product.isPrime && <PrimeBadge compact />}
                <p className="mt-1">
                  FREE delivery{' '}
                  <strong className="text-[#0F1111]">{product.deliveryDateText}</strong>
                </p>
              </div>

              <div className="flex items-start gap-1.5 text-[12px] text-[#007185]">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#565959]" />
                <span>Deliver to Singapore {postalCode}</span>
              </div>

              <div className="text-[16px] font-medium text-[#007600]">
                {product.stockNote}
              </div>

              {/* Qty Select */}
              <div className="flex items-center gap-2">
                <label htmlFor="pdp-qty" className="text-[13px] text-[#0F1111]">
                  Quantity:
                </label>
                <select
                  id="pdp-qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-[7px] px-2.5 py-1 text-[13px] shadow-xs cursor-pointer"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons (6:4 size ratio) */}
              <div className="space-y-2 pt-1 flex flex-col items-start">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full h-[32px] px-3 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[12px] font-medium text-[#0F1111] cursor-pointer transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#007600]" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <span>Add to Cart</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onBuyNow(product, activeVariant.name, qty)}
                  className="w-full h-[48px] px-4 bg-[#FFA41C] hover:bg-[#FA8900] border border-[#FF8F00] rounded-full text-[14px] font-semibold text-[#0F1111] cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center"
                >
                  Buy now with 1-Click
                </button>
              </div>

              <div className="pt-2 border-t border-[#E7E7E7] space-y-1.5 text-[12px] text-[#565959]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure transaction</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ships from Amazon SG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
