import React, { useState } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import {
  ALL_BRANDS,
  ALL_FEATURES,
  CaseCategory,
  CaseFeature,
  Product,
} from '../data/products';
import { PrimeBadge, StarRating } from './AmazonMarks';

export interface FilterState {
  primeOnly: boolean;
  tomorrowOnly: boolean;
  category: CaseCategory;
  minRating: number | null;
  brands: Product['brand'][];
  priceRange: { min: number | null; max: number | null };
  features: CaseFeature[];
  dealsOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onResetAll: () => void;
  brandCounts: Record<string, number>;
  hasActiveFilters: boolean;
}

const CATEGORIES: CaseCategory[] = [
  'All Cases',
  'Basic Cases',
  'Hinge-Protection Cases',
  'Folio & Wallet Cases',
  'Rugged Cases',
];

const PRICE_PRESETS: { label: string; min: number | null; max: number | null }[] = [
  { label: 'Under S$25', min: null, max: 25 },
  { label: 'S$25 to S$50', min: 25, max: 50 },
  { label: 'S$50 to S$80', min: 50, max: 80 },
  { label: 'S$80 & Above', min: 80, max: null },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onResetAll,
  brandCounts,
  hasActiveFilters,
}) => {
  const [minDraft, setMinDraft] = useState(
    filters.priceRange.min !== null ? String(filters.priceRange.min) : ''
  );
  const [maxDraft, setMaxDraft] = useState(
    filters.priceRange.max !== null ? String(filters.priceRange.max) : ''
  );

  const toggleBrand = (brand: Product['brand']) => {
    const exists = filters.brands.includes(brand);
    onChange({
      ...filters,
      brands: exists
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });
  };

  const toggleFeature = (feat: CaseFeature) => {
    const exists = filters.features.includes(feat);
    onChange({
      ...filters,
      features: exists
        ? filters.features.filter((f) => f !== feat)
        : [...filters.features, feat],
    });
  };

  const applyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = minDraft.trim() ? Number(minDraft) : null;
    const maxVal = maxDraft.trim() ? Number(maxDraft) : null;
    onChange({
      ...filters,
      priceRange: {
        min: minVal !== null && !Number.isNaN(minVal) ? minVal : null,
        max: maxVal !== null && !Number.isNaN(maxVal) ? maxVal : null,
      },
    });
  };

  return (
    <aside aria-label="Search filters" className="w-full text-[13px] text-[#0F1111] space-y-5">
      {hasActiveFilters && (
        <div className="pb-3 border-b border-[#E7E7E7]">
          <button
            type="button"
            onClick={() => {
              setMinDraft('');
              setMaxDraft('');
              onResetAll();
            }}
            className="text-[12px] font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Amazon Prime */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Amazon Prime</h3>
        <label className="flex items-center gap-2 cursor-pointer py-0.5 group">
          <input
            type="checkbox"
            checked={filters.primeOnly}
            onChange={(e) => onChange({ ...filters, primeOnly: e.target.checked })}
            className="w-4 h-4 accent-[#007185] rounded-[2px] cursor-pointer"
          />
          <PrimeBadge />
        </label>
      </section>

      {/* Delivery Day */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Delivery Day</h3>
        <label className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-[#C7511F]">
          <input
            type="checkbox"
            checked={filters.tomorrowOnly}
            onChange={(e) => onChange({ ...filters, tomorrowOnly: e.target.checked })}
            className="w-4 h-4 accent-[#007185] rounded-[2px] cursor-pointer"
          />
          <span>Get It by Tomorrow</span>
        </label>
      </section>

      {/* Department */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Department</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-[#565959] text-[12px]">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Mobile Phones &amp; Accessories</span>
          </div>
          <div className="pl-3 font-semibold text-[#0F1111] text-[13px]">
            Cases, Holsters &amp; Sleeves
          </div>
          <ul className="pl-5 space-y-1">
            {CATEGORIES.map((cat) => {
              const active = filters.category === cat;
              return (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => onChange({ ...filters, category: cat })}
                    className={`text-left hover:text-[#C7511F] cursor-pointer ${
                      active ? 'font-bold text-[#0F1111]' : 'text-[#0F1111]'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Customer Reviews */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Customer Reviews</h3>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const active = filters.minRating === stars;
            return (
              <button
                key={stars}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    minRating: active ? null : stars,
                  })
                }
                className={`flex items-center gap-1.5 w-full text-left py-0.5 hover:text-[#C7511F] cursor-pointer ${
                  active ? 'font-bold text-[#C7511F]' : ''
                }`}
              >
                <StarRating rating={stars} size="sm" />
                <span>&amp; Up</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Brand */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Brand</h3>
        <div className="space-y-1.5">
          {ALL_BRANDS.map((brand) => {
            const checked = filters.brands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between gap-2 cursor-pointer hover:text-[#C7511F]"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brand)}
                    className="w-4 h-4 accent-[#007185] rounded-[2px] cursor-pointer"
                  />
                  <span className={checked ? 'font-semibold' : ''}>{brand}</span>
                </span>
                <span className="text-[11px] text-[#565959] tabular-nums">
                  ({brandCounts[brand] ?? 0})
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Price */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Price</h3>
        <ul className="space-y-1 mb-2.5">
          {PRICE_PRESETS.map((preset) => {
            const isSelected =
              filters.priceRange.min === preset.min &&
              filters.priceRange.max === preset.max;
            return (
              <li key={preset.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setMinDraft('');
                      setMaxDraft('');
                      onChange({ ...filters, priceRange: { min: null, max: null } });
                    } else {
                      setMinDraft(preset.min !== null ? String(preset.min) : '');
                      setMaxDraft(preset.max !== null ? String(preset.max) : '');
                      onChange({
                        ...filters,
                        priceRange: { min: preset.min, max: preset.max },
                      });
                    }
                  }}
                  className={`text-left hover:text-[#C7511F] cursor-pointer ${
                    isSelected ? 'font-bold text-[#C7511F]' : ''
                  }`}
                >
                  {preset.label}
                </button>
              </li>
            );
          })}
        </ul>
        <form onSubmit={applyCustomPrice} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={minDraft}
              onChange={(e) => setMinDraft(e.target.value)}
              aria-label="Minimum price in SGD"
              className="w-full pl-6 pr-1.5 py-1 border border-[#888C8C] rounded-[3px] text-[12px] tabular-nums focus:outline-none focus:border-[#007185]"
            />
          </div>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[#565959]">
              S$
            </span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={maxDraft}
              onChange={(e) => setMaxDraft(e.target.value)}
              aria-label="Maximum price in SGD"
              className="w-full pl-6 pr-1.5 py-1 border border-[#888C8C] rounded-[3px] text-[12px] tabular-nums focus:outline-none focus:border-[#007185]"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 border border-[#D5D9D9] bg-white hover:bg-[#F7FAFA] rounded-[7px] text-[12px] shadow-xs cursor-pointer"
          >
            Go
          </button>
        </form>
      </section>

      {/* Case Features */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Case Features</h3>
        <div className="space-y-1.5">
          {ALL_FEATURES.map((feat) => {
            const checked = filters.features.includes(feat);
            return (
              <label
                key={feat}
                className="flex items-center gap-2 cursor-pointer hover:text-[#C7511F]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleFeature(feat)}
                  className="w-4 h-4 accent-[#007185] rounded-[2px] cursor-pointer"
                />
                <span className={checked ? 'font-semibold' : ''}>{feat}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Deals */}
      <section>
        <h3 className="font-bold text-[14px] mb-1.5 text-[#0F1111]">Deals &amp; Discounts</h3>
        <label className="flex items-center gap-2 cursor-pointer hover:text-[#C7511F]">
          <input
            type="checkbox"
            checked={filters.dealsOnly}
            onChange={(e) => onChange({ ...filters, dealsOnly: e.target.checked })}
            className="w-4 h-4 accent-[#007185] rounded-[2px] cursor-pointer"
          />
          <span className="flex items-center gap-1">
            All Discounts
            {filters.dealsOnly && <Check className="w-3.5 h-3.5 text-[#007600]" />}
          </span>
        </label>
      </section>
    </aside>
  );
};
