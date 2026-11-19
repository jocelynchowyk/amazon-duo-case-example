import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  X,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  PRODUCTS,
  Product,
  RELATED_SEARCHES,
  ALL_BRANDS,
} from './data/products';
import { Navbar } from './components/Navbar';
import { FilterSidebar, FilterState } from './components/FilterSidebar';
import { SponsoredBrandBanner } from './components/SponsoredBrandBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { LocationModal } from './components/LocationModal';
import { Footer } from './components/Footer';
import { AmazonLogoDark } from './components/AmazonMarks';

type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'reviews-desc';

const INITIAL_FILTERS: FilterState = {
  primeOnly: false,
  tomorrowOnly: false,
  category: 'All Cases',
  minRating: null,
  brands: [],
  priceRange: { min: null, max: null },
  features: [],
  dealsOnly: false,
};

const PAGE_SIZE = 12;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('iphone duo case');
  const [searchDepartment, setSearchDepartment] = useState('All Departments');
  const [postalCode, setPostalCode] = useState('018956');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  // Per-card variant selection
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({});

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals & Drawers
  const [modalProduct, setModalProduct] = useState<{
    product: Product;
    variantIdx: number;
  } | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isAllDrawerOpen, setIsAllDrawerOpen] = useState(false);

  const hasActiveFilters =
    filters.primeOnly ||
    filters.tomorrowOnly ||
    filters.category !== 'All Cases' ||
    filters.minRating !== null ||
    filters.brands.length > 0 ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null ||
    filters.features.length > 0 ||
    filters.dealsOnly;

  // Brand counts for sidebar
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const b of ALL_BRANDS) counts[b] = 0;
    for (const p of PRODUCTS) {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtering + Searching + Sorting
  const filteredProducts = useMemo(() => {
    const rawTokens = searchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter((t) => t && !['iphone', 'duo', 'case', 'cases', 'for'].includes(t));

    const matched = PRODUCTS.filter((p) => {
      // Keyword tokens beyond base "iphone duo case"
      if (rawTokens.length > 0) {
        const haystack = [
          p.title,
          p.brand,
          p.category,
          p.material,
          ...p.features,
          ...p.variants.map((v) => v.name),
        ]
          .join(' ')
          .toLowerCase();

        const matchesAll = rawTokens.every((tok) => haystack.includes(tok));
        if (!matchesAll) return false;
      }

      if (searchDepartment === 'Amazon Prime' && !p.isPrime) return false;
      if (filters.primeOnly && !p.isPrime) return false;
      if (filters.tomorrowOnly && !p.isTomorrowDelivery) return false;
      if (filters.category !== 'All Cases' && p.category !== filters.category) return false;
      if (filters.minRating !== null && p.rating < filters.minRating) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;

      if (filters.priceRange.min !== null && p.priceSGD < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== null && p.priceSGD > filters.priceRange.max) {
        return false;
      }

      if (
        filters.features.length > 0 &&
        !filters.features.every((f) => p.features.includes(f))
      ) {
        return false;
      }

      if (filters.dealsOnly && !p.listPriceSGD && !p.voucherDiscountPct) {
        return false;
      }

      return true;
    });

    const sorted = [...matched];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.priceSGD - b.priceSGD);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.priceSGD - a.priceSGD);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        break;
    }

    return sorted;
  }, [searchQuery, searchDepartment, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  // Cart handlers
  const handleAddToCart = (
    product: Product,
    variantName: string,
    voucherApplied = false,
    qty = 1
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.variantName === variantName
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + qty,
          voucherApplied: updated[idx].voucherApplied || voucherApplied,
        };
        return updated;
      }
      return [...prev, { product, variantName, quantity: qty, voucherApplied }];
    });
  };

  const handleUpdateQty = (productId: string, variantName: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.variantName === variantName) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string, variantName: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variantName === variantName)
      )
    );
  };

  const getCardCartQty = (product: Product) => {
    const vIdx = selectedVariants[product.id] ?? 0;
    const variantName = (product.variants[vIdx] || product.variants[0]).name;
    return (
      cart.find((c) => c.product.id === product.id && c.variantName === variantName)
        ?.quantity ?? 0
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleResetAll = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('iphone duo case');
    setSearchDepartment('All Departments');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const handleQuickNavFilter = (preset: string) => {
    setCurrentPage(1);
    switch (preset) {
      case 'prime':
        setFilters({ ...INITIAL_FILTERS, primeOnly: true });
        break;
      case 'bestsellers':
        setFilters(INITIAL_FILTERS);
        setSortBy('reviews-desc');
        break;
      case 'deals':
        setFilters({ ...INITIAL_FILTERS, dealsOnly: true });
        break;
      case 'tomorrow':
        setFilters({ ...INITIAL_FILTERS, tomorrowOnly: true });
        break;
      case 'magsafe':
        setFilters({ ...INITIAL_FILTERS, features: ['MagSafe Compatible'] });
        break;
      case 'hinge':
        setFilters({ ...INITIAL_FILTERS, features: ['Hinge Protection'] });
        break;
      case 'reset':
      default:
        handleResetAll();
        break;
    }
  };

  const startIdx = filteredProducts.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIdx = Math.min(safePage * PAGE_SIZE, filteredProducts.length);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F1111]">
      <Navbar
        searchQuery={searchQuery}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        searchDepartment={searchDepartment}
        onDepartmentChange={(dept) => {
          setSearchDepartment(dept);
          setCurrentPage(1);
        }}
        postalCode={postalCode}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onQuickNavFilter={handleQuickNavFilter}
        onOpenAllDrawer={() => setIsAllDrawerOpen(true)}
      />

      {/* Results Summary Bar */}
      <div className="bg-white border-b border-[#D5D9D9] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-[13px]">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#D5D9D9] rounded-[6px] bg-[#F0F2F2] text-[12px] font-medium cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <p className="text-[#0F1111] truncate">
              <span className="tabular-nums">
                {startIdx}-{endIdx}
              </span>{' '}
              of{' '}
              <span className="tabular-nums">
                {hasActiveFilters || searchQuery.toLowerCase() !== 'iphone duo case'
                  ? filteredProducts.length
                  : 'over 400'}
              </span>{' '}
              results for{' '}
              <span className="font-bold text-[#C7511F]">&ldquo;{searchQuery}&rdquo;</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* View Toggle */}
            <div
              className="hidden sm:inline-flex items-center border border-[#D5D9D9] rounded-[6px] overflow-hidden bg-[#F0F2F2]"
              role="group"
              aria-label="Results view mode"
            >
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 cursor-pointer ${
                  layoutMode === 'grid' ? 'bg-white text-[#0F1111]' : 'text-[#565959]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                aria-label="List view"
                className={`p-1.5 cursor-pointer ${
                  layoutMode === 'list' ? 'bg-white text-[#0F1111]' : 'text-[#565959]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-select" className="text-[12px] text-[#565959] hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-[#F0F2F2] hover:bg-[#E3E6E6] border border-[#D5D9D9] rounded-[7px] px-2.5 py-1 text-[12px] font-medium text-[#0F1111] shadow-xs cursor-pointer focus:outline-none focus:border-[#007185]"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Avg. Customer Review</option>
                <option value="reviews-desc">Best Sellers</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar + Results */}
      <main className="flex-1 w-full max-w-[1520px] mx-auto px-3 sm:px-5 py-4 flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[235px] shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setCurrentPage(1);
            }}
            onResetAll={() => {
              setFilters(INITIAL_FILTERS);
              setCurrentPage(1);
            }}
            brandCounts={brandCounts}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Results Column */}
        <div className="flex-1 min-w-0">
          {/* Sponsored Brand Banner (on page 1 default) */}
          {safePage === 1 && !hasActiveFilters && (
            <SponsoredBrandBanner
              products={PRODUCTS.filter((p) => p.brand === 'Spigen')}
              onSelectProduct={(p) => setModalProduct({ product: p, variantIdx: 0 })}
              onFilterBySpigen={() => {
                setFilters({ ...INITIAL_FILTERS, brands: ['Spigen'] });
                setCurrentPage(1);
              }}
            />
          )}

          {/* Results Section Header */}
          <div className="mb-3">
            <h1 className="text-[20px] font-bold text-[#0F1111] leading-tight">
              Results
            </h1>
            <p className="text-[13px] text-[#565959]">
              Check each product page for other buying options. Price and other details may vary
              based on product size and colour.
            </p>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="border border-[#D5D9D9] rounded-[6px] p-10 text-center bg-[#FAFAFA] my-6">
              <p className="text-[17px] font-semibold text-[#0F1111] mb-1">
                No results for &ldquo;{searchQuery}&rdquo; with your current filters.
              </p>
              <p className="text-[13px] text-[#565959] mb-4">
                Try clearing a filter or broadening your search term.
              </p>
              <button
                type="button"
                onClick={handleResetAll}
                className="px-5 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[13px] font-medium text-[#0F1111] cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            /* Product Grid / List */
            <div
              className={
                layoutMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5'
                  : 'flex flex-col gap-3.5'
              }
            >
              {paginatedProducts.map((product) => {
                const variantIdx = selectedVariants[product.id] ?? 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQuantity={getCardCartQty(product)}
                    selectedVariantIdx={variantIdx}
                    onSelectVariant={(idx) =>
                      setSelectedVariants((prev) => ({ ...prev, [product.id]: idx }))
                    }
                    onAddToCart={(prod, variantName, voucher) =>
                      handleAddToCart(prod, variantName, voucher, 1)
                    }
                    onUpdateQty={handleUpdateQty}
                    onOpenModal={(prod, vIdx) =>
                      setModalProduct({ product: prod, variantIdx: vIdx })
                    }
                    layoutMode={layoutMode}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav
                aria-label="Pagination"
                className="inline-flex items-center border border-[#D5D9D9] rounded-[8px] overflow-hidden bg-white shadow-xs text-[13px]"
              >
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 flex items-center gap-1 border-r border-[#D5D9D9] hover:bg-[#F7FAFA] disabled:text-[#888C8C] disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 border-r border-[#D5D9D9] tabular-nums cursor-pointer ${
                      pageNum === safePage
                        ? 'font-bold bg-[#F7F8F8] border-b-2 border-b-[#0F1111]'
                        : 'hover:bg-[#F7FAFA]'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 flex items-center gap-1 hover:bg-[#F7FAFA] disabled:text-[#888C8C] disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          )}

          {/* Related Searches */}
          <section className="mt-10 pt-6 border-t border-[#E7E7E7]">
            <h2 className="text-[18px] font-bold text-[#0F1111] mb-3">
              Related searches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {RELATED_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    setFilters(INITIAL_FILTERS);
                    setCurrentPage(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 border border-[#D5D9D9] rounded-[4px] hover:bg-[#F7F8F8] text-left text-[13px] text-[#0F1111] cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#565959] shrink-0" />
                  <span className="truncate font-medium">{term}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer
        onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onQuickSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex justify-start lg:hidden"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="bg-white w-[300px] max-w-[85vw] h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 bg-[#232F3E] text-white flex items-center justify-between">
              <span className="font-bold text-[15px]">Filters</span>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar
                filters={filters}
                onChange={(next) => {
                  setFilters(next);
                  setCurrentPage(1);
                }}
                onResetAll={() => {
                  setFilters(INITIAL_FILTERS);
                  setCurrentPage(1);
                }}
                brandCounts={brandCounts}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
            <div className="p-3 border-t border-[#E7E7E7] bg-[#F7F8F8]">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2 bg-[#FFD814] rounded-full text-[13px] font-medium text-[#0F1111]"
              >
                Show {filteredProducts.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "All" Navigation Department Drawer */}
      {isAllDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/55 flex justify-start"
          onClick={() => setIsAllDrawerOpen(false)}
        >
          <div
            className="bg-white w-[320px] max-w-[85vw] h-full flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3.5 bg-[#232F3E] text-white flex items-center justify-between">
              <span className="font-bold text-[16px]">Browse Amazon.sg</span>
              <button
                type="button"
                onClick={() => setIsAllDrawerOpen(false)}
                aria-label="Close menu"
                className="p-1 hover:bg-white/10 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E7E7E7] text-[14px]">
              <div className="p-4 flex items-center justify-between">
                <AmazonLogoDark />
                <span className="text-[12px] text-[#565959] tabular-nums">
                  SG {postalCode}
                </span>
              </div>

              <div className="py-3">
                <div className="px-5 pb-2 text-[15px] font-bold text-[#0F1111]">
                  Trending Case Collections
                </div>
                {[
                  { label: 'All iPhone Duo Cases', action: () => handleQuickNavFilter('reset') },
                  { label: 'Prime Eligible Only', action: () => handleQuickNavFilter('prime') },
                  { label: 'Next-Day Delivery (SG)', action: () => handleQuickNavFilter('tomorrow') },
                  { label: 'Best Sellers', action: () => handleQuickNavFilter('bestsellers') },
                  { label: "Today's Deals", action: () => handleQuickNavFilter('deals') },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      item.action();
                      setIsAllDrawerOpen(false);
                    }}
                    className="w-full px-5 py-2.5 text-left hover:bg-[#EAEDED] flex items-center justify-between cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#565959]" />
                  </button>
                ))}
              </div>

              <div className="py-3">
                <div className="px-5 pb-2 text-[15px] font-bold text-[#0F1111]">
                  Shop by Brand
                </div>
                {ALL_BRANDS.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => {
                      setFilters({ ...INITIAL_FILTERS, brands: [brand] });
                      setCurrentPage(1);
                      setIsAllDrawerOpen(false);
                    }}
                    className="w-full px-5 py-2 text-left hover:bg-[#EAEDED] flex items-center justify-between cursor-pointer"
                  >
                    <span>{brand}</span>
                    <ChevronRight className="w-4 h-4 text-[#565959]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Quick-View Modal */}
      <ProductModal
        product={modalProduct?.product ?? null}
        initialVariantIdx={modalProduct?.variantIdx ?? 0}
        postalCode={postalCode}
        onClose={() => setModalProduct(null)}
        onAddToCart={(prod, vName, qty) => handleAddToCart(prod, vName, false, qty)}
        onBuyNow={(prod, vName, qty) => {
          handleAddToCart(prod, vName, false, qty);
          setModalProduct(null);
          setIsCartOpen(true);
        }}
      />

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        postalCode={postalCode}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
      />

      {/* Singapore Delivery Postal Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        currentPostalCode={postalCode}
        onClose={() => setIsLocationOpen(false)}
        onApplyPostalCode={(code) => setPostalCode(code)}
      />
    </div>
  );
}
