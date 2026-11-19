import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { AmazonLogo } from './AmazonMarks';
import { RELATED_SEARCHES } from '../data/products';

interface NavbarProps {
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  searchDepartment: string;
  onDepartmentChange: (dept: string) => void;
  postalCode: string;
  onOpenLocationModal: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onQuickNavFilter: (preset: string) => void;
  onOpenAllDrawer: () => void;
}

const SEARCH_DEPARTMENTS = [
  'All Departments',
  'Electronics',
  'Mobile Phones & Accessories',
  'Cases & Covers',
  'Amazon Prime',
];

const SUGGESTION_POOL = [
  'iphone duo case',
  'iphone duo case magsafe',
  'iphone duo clear case',
  'iphone duo hinge protection case',
  'spigen iphone duo case',
  'esr iphone duo kickstand case',
  'iphone duo leather wallet case',
  'iphone duo screen protector',
  ...RELATED_SEARCHES,
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchSubmit,
  searchDepartment,
  onDepartmentChange,
  postalCode,
  onOpenLocationModal,
  cartCount,
  onOpenCart,
  onQuickNavFilter,
  onOpenAllDrawer,
}) => {
  const [draft, setDraft] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSignInHint, setShowSignInHint] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraft(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredSuggestions = Array.from(new Set(SUGGESTION_POOL))
    .filter((item) =>
      draft.trim() === ''
        ? true
        : item.toLowerCase().includes(draft.trim().toLowerCase())
    )
    .slice(0, 7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(draft.trim() || 'iphone duo case');
    setShowSuggestions(false);
  };

  return (
    <header className="w-full bg-[#131921] text-white relative z-40">
      {/* Main Header Row */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 h-[60px] flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu + Brand Logo */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenAllDrawer}
            className="lg:hidden p-2 rounded hover:outline hover:outline-1 hover:outline-white text-white focus-visible:outline-2 focus-visible:outline-[#FF9900]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onQuickNavFilter('reset')}
            className="px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white flex items-center focus-visible:outline-2 focus-visible:outline-[#FF9900] shrink-0"
            aria-label="Amazon.sg Home"
          >
            <AmazonLogo />
          </button>
        </div>

        {/* Deliver to Singapore */}
        <button
          type="button"
          onClick={onOpenLocationModal}
          className="hidden md:flex items-end gap-1 px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-left shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF9900]"
        >
          <MapPin className="w-4 h-4 text-white mb-0.5 shrink-0" />
          <div className="leading-tight">
            <div className="text-[11px] text-[#CCCCCC] whitespace-nowrap">Deliver to</div>
            <div className="text-[13px] font-bold text-white whitespace-nowrap tabular-nums">
              Singapore {postalCode}
            </div>
          </div>
        </button>

        {/* Search Bar */}
        <div ref={searchBoxRef} className="flex-1 min-w-0 relative">
          <form
            onSubmit={handleSubmit}
            className="flex h-[40px] rounded-[4px] overflow-hidden focus-within:ring-[3px] focus-within:ring-[#FF9900] bg-white"
            role="search"
          >
            {/* Department Select */}
            <div className="hidden sm:flex items-center relative bg-[#E6E6E6] hover:bg-[#D4D4D4] border-r border-[#CDCDCD] text-[#555555] transition-colors shrink-0">
              <select
                value={searchDepartment}
                onChange={(e) => onDepartmentChange(e.target.value)}
                aria-label="Search in department"
                className="appearance-none bg-transparent pl-3 pr-7 h-full text-[12px] font-medium text-[#333333] cursor-pointer focus:outline-none max-w-[140px] truncate"
              >
                {SEARCH_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#555555] absolute right-2 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="flex-1 relative flex items-center bg-white">
              <input
                type="text"
                value={draft}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search Amazon.sg"
                aria-label="Search Amazon.sg"
                className="w-full h-full px-3 pr-8 text-[14px] text-[#0F1111] placeholder:text-[#565959] focus:outline-none"
              />
              {draft && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft('');
                    setShowSuggestions(true);
                  }}
                  className="absolute right-2 p-1 text-[#565959] hover:text-[#0F1111]"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-[45px] bg-[#FEBD69] hover:bg-[#F3A847] text-[#111111] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              aria-label="Go"
            >
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[42px] bg-white border border-[#D5D9D9] rounded-b-[4px] shadow-lg z-50 py-1">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setDraft(item);
                    onSearchSubmit(item);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-[14px] text-[#0F1111] hover:bg-[#F0F2F2] flex items-center gap-2.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#565959] shrink-0" />
                  <span className="truncate font-medium">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* SG Locale */}
          <button
            type="button"
            onClick={onOpenLocationModal}
            className="hidden xl:flex items-center gap-1.5 px-2 py-2 rounded hover:outline hover:outline-1 hover:outline-white text-[13px] font-bold whitespace-nowrap shrink-0"
            title="Region: Singapore (SGD)"
          >
            <span className="inline-flex items-center justify-center w-5 h-3.5 rounded-[2px] overflow-hidden border border-white/20 text-[9px] leading-none bg-[#EF3340] text-white font-bold">
              SG
            </span>
            <span>EN</span>
            <ChevronDown className="w-3 h-3 text-[#CCCCCC]" />
          </button>

          {/* Account & Lists */}
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setShowSignInHint((v) => !v)}
              className="px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-left leading-tight whitespace-nowrap shrink-0"
            >
              <div className="text-[11px] text-[#CCCCCC]">Hello, sign in</div>
              <div className="text-[13px] font-bold flex items-center gap-0.5">
                <span>Account & Lists</span>
                <ChevronDown className="w-3 h-3 text-[#CCCCCC]" />
              </div>
            </button>

            {showSignInHint && (
              <div className="absolute right-0 top-[52px] w-[260px] bg-white text-[#0F1111] rounded border border-[#D5D9D9] shadow-xl p-4 z-50">
                <p className="text-[13px] font-semibold mb-2">Shopper Session</p>
                <p className="text-[12px] text-[#565959] mb-3">
                  Browsing Amazon Singapore (Prime SG eligible items available for instant cart checkout).
                </p>
                <button
                  type="button"
                  onClick={() => setShowSignInHint(false)}
                  className="w-full py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] rounded-full text-[13px] font-medium text-[#0F1111] border border-[#FCD200] cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <button
            type="button"
            onClick={onOpenCart}
            className="hidden lg:block px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white text-left leading-tight whitespace-nowrap shrink-0 cursor-pointer"
          >
            <div className="text-[11px] text-[#CCCCCC]">Returns</div>
            <div className="text-[13px] font-bold">& Orders</div>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-end gap-1 px-2.5 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white focus-visible:outline-2 focus-visible:outline-[#FF9900] relative cursor-pointer shrink-0"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-7 h-7 text-white stroke-[1.8]" />
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 min-w-[18px] px-1 text-center text-[14px] font-bold text-[#F08804] bg-[#131921] rounded-full leading-none tabular-nums">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline text-[13px] font-bold pb-0.5">Cart</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Strip (#232F3E) */}
      <nav
        aria-label="Amazon.sg quick links"
        className="bg-[#232F3E] border-t border-white/5 text-white text-[13px]"
      >
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 h-[38px] flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={onOpenAllDrawer}
            className="flex items-center gap-1 px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white font-bold whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>All</span>
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('prime')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Prime
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('bestsellers')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Best Sellers
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('deals')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Today&apos;s Deals
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('tomorrow')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Next-Day Delivery
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('magsafe')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            MagSafe Cases
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('hinge')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Hinge Armor
          </button>
          <button
            type="button"
            onClick={() => onQuickNavFilter('reset')}
            className="px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            Electronics
          </button>
          <button
            type="button"
            onClick={() => onOpenLocationModal()}
            className="hidden md:inline-flex items-center gap-1 ml-auto px-2.5 py-1 rounded hover:outline hover:outline-1 hover:outline-white text-[#CCCCCC] hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>SG Delivery Settings</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
