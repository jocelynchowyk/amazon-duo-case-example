import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Product } from '../data/products';
import { PrimeBadge } from './AmazonMarks';

export interface CartItem {
  product: Product;
  variantName: string;
  quantity: number;
  voucherApplied: boolean;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  postalCode: string;
  onClose: () => void;
  onUpdateQty: (productId: string, variantName: string, delta: number) => void;
  onRemoveItem: (productId: string, variantName: string) => void;
  onClearCart: () => void;
}

const FREE_SHIPPING_THRESHOLD = 40;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  postalCode,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutMode(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getUnitPrice = (item: CartItem) => {
    if (item.voucherApplied && item.product.voucherDiscountPct) {
      return item.product.priceSGD * (1 - item.product.voucherDiscountPct / 100);
    }
    return item.product.priceSGD;
  };

  const subtotal = items.reduce(
    (sum, item) => sum + getUnitPrice(item) * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const qualifiesFreeShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || items.every((i) => i.product.isPrime);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `402-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(
      1000000 + Math.random() * 9000000
    )}`;
    setOrderPlacedId(orderNum);
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[440px] h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#232F3E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#FF9900]" />
            <h2 className="text-[16px] font-bold">
              Shopping Cart ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 rounded hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Success State */}
        {orderPlacedId ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#007600]" />
            <div>
              <h3 className="text-[18px] font-bold text-[#0F1111]">
                Order placed, thank you!
              </h3>
              <p className="text-[13px] text-[#565959] mt-1 font-mono-tabular">
                Order #{orderPlacedId}
              </p>
            </div>
            <div className="w-full bg-[#F7F8F8] border border-[#D5D9D9] rounded-[6px] p-4 text-left text-[13px] space-y-1">
              <p className="font-semibold text-[#0F1111]">
                Delivering to {recipientName || 'Customer'} (Singapore {postalCode})
              </p>
              {streetAddress && <p className="text-[#565959]">{streetAddress}</p>}
              <p className="text-[#007600] font-medium pt-1">
                Estimated arrival: Tomorrow, 19 Nov
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOrderPlacedId(null);
                setCheckoutMode(false);
                onClose();
              }}
              className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[13px] font-medium text-[#0F1111] cursor-pointer"
            >
              Continue shopping on Amazon.sg
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-[#CCCCCC]" />
            <h3 className="text-[17px] font-semibold text-[#0F1111]">
              Your Amazon Cart is empty
            </h3>
            <p className="text-[13px] text-[#565959] max-w-[260px]">
              Browse iPhone Duo cases with Prime Next-Day Delivery across Singapore.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[13px] font-medium text-[#0F1111] cursor-pointer"
            >
              Explore iPhone Duo Cases
            </button>
          </div>
        ) : checkoutMode ? (
          /* Express Singapore Checkout View */
          <form onSubmit={handleConfirmOrder} className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-5 space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-[#0F1111]">
                  Express Singapore Checkout
                </h3>
                <button
                  type="button"
                  onClick={() => setCheckoutMode(false)}
                  className="text-[12px] text-[#007185] hover:underline cursor-pointer"
                >
                  Back to Cart
                </button>
              </div>

              <div className="bg-[#F7F8F8] border border-[#D5D9D9] rounded-[6px] p-3 text-[13px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#565959]">Items ({totalCount}):</span>
                  <span className="tabular-nums">S${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#565959]">SG Delivery:</span>
                  <span className="text-[#007600] font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-[15px] pt-1.5 border-t border-[#E7E7E7]">
                  <span>Order Total:</span>
                  <span className="text-[#B12704] tabular-nums">S${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3 text-[13px]">
                <div>
                  <label className="block font-semibold mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Wei Ming Tan"
                    className="w-full px-3 py-2 border border-[#888C8C] rounded-[4px] focus:outline-none focus:border-[#007185]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">
                    Singapore Street &amp; Unit No.
                  </label>
                  <input
                    required
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. 10 Bayfront Avenue, #12-04"
                    className="w-full px-3 py-2 border border-[#888C8C] rounded-[4px] focus:outline-none focus:border-[#007185]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Postal Code</label>
                    <input
                      readOnly
                      value={postalCode}
                      className="w-full px-3 py-2 bg-[#F0F2F2] border border-[#D5D9D9] rounded-[4px] tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">SG Mobile</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+65 9123 4567"
                      className="w-full px-3 py-2 border border-[#888C8C] rounded-[4px] focus:outline-none focus:border-[#007185]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E7E7E7] bg-[#F7F8F8]">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[14px] font-medium text-[#0F1111] cursor-pointer"
              >
                Place your order in SGD
              </button>
            </div>
          </form>
        ) : (
          /* Cart Item List */
          <>
            {/* Free Delivery Banner */}
            <div className="px-5 py-3 bg-[#F7F8F8] border-b border-[#E7E7E7] text-[12px]">
              {qualifiesFreeShipping ? (
                <div className="flex items-start gap-2 text-[#007600]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Your order qualifies for <strong>FREE Delivery in Singapore</strong>.
                  </span>
                </div>
              ) : (
                <div className="text-[#0F1111]">
                  Add <strong>S${remainingForFree.toFixed(2)}</strong> of eligible items to
                  qualify for FREE SG delivery.
                </div>
              )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#E7E7E7]">
              {items.map((item) => {
                const variantObj =
                  item.product.variants.find((v) => v.name === item.variantName) ||
                  item.product.variants[0];
                const unitPrice = getUnitPrice(item);

                return (
                  <div
                    key={`${item.product.id}-${item.variantName}`}
                    className="p-4 flex gap-3.5"
                  >
                    <div className="w-20 h-20 bg-[#F7F7F7] rounded-[3px] p-1.5 flex items-center justify-center shrink-0">
                      <img
                        src={variantObj.image}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] leading-[1.35] font-medium text-[#0F1111] line-clamp-2">
                        {item.product.title}
                      </h4>
                      <div className="text-[12px] text-[#565959] mt-0.5">
                        Colour: <span className="text-[#0F1111]">{item.variantName}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[14px] font-bold text-[#0F1111] tabular-nums">
                          S${unitPrice.toFixed(2)}
                        </span>
                        {item.product.isPrime && <PrimeBadge compact />}
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
                        <div className="inline-flex items-center border border-[#D5D9D9] rounded-full bg-[#F0F2F2] overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQty(item.product.id, item.variantName, -1)
                            }
                            aria-label="Decrease quantity"
                            className="px-2 py-1 hover:bg-[#E3E6E6] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-[12px] font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQty(item.product.id, item.variantName, 1)
                            }
                            aria-label="Increase quantity"
                            className="px-2 py-1 hover:bg-[#E3E6E6] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.variantName)}
                          className="inline-flex items-center gap-1 text-[12px] text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E7E7E7] bg-[#F7F8F8] space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] text-[#0F1111]">
                  Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'}):
                </span>
                <span className="text-[18px] font-bold text-[#0F1111] tabular-nums">
                  S${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutMode(true)}
                className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full text-[13px] font-medium text-[#0F1111] cursor-pointer transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
